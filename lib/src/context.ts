import { fail } from 'node:assert'
import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import { associateId } from './associateId.ts'
import { DeepCache } from './cache.ts'

type Context<T> = {
	'~storage': AsyncLocalStorage<T | EMPTY>
	provide(value: T): ProvidedContext<T>
	consume(): T
}
export type ProvidedContext<T = unknown> = [AsyncLocalStorage<T | EMPTY>, T]

export async function runWithContexts<R>(
	contexts: ProvidedContext[],
	fn: () => Promise<R>,
): Promise<R> {
	const reversed = [...contexts].reverse()
	for (const [storage, value] of reversed) {
		const prevFunction = fn
		fn = () => {
			return storage.run(value, async () => await prevFunction())
		}
	}
	return fn()
}

const EMPTY = Symbol('empty')
type EMPTY = typeof EMPTY
export function createContext<T>(
	name: string,
	getDefaultValue: () => T = () =>
		fail(`No default value for context: ${name}`),
): Context<T> {
	const storage = new AsyncLocalStorage<T | EMPTY>()
	storage.enterWith(EMPTY)
	return {
		['~storage']: storage,

		provide(value: T): ProvidedContext<T> {
			return [storage, value] as const
		},

		consume() {
			const value = storage.getStore()
			if (value === EMPTY) return getDefaultValue()
			else return value!
		},
	}
}

export function getSnapshotId(contexts: ProvidedContext[]): string {
	return associateId(contexts.flat())
}
