interface AnyWriteable<T = unknown> {
	content: () => T | Promise<T>
}

export type Writeable = AnyWriteable | WriteableDir

export interface WriteableDir<T extends DirContent = DirContent>
	extends AnyWriteable<T> {
	readonly '~kind': 'dir'
}

export interface Inflatable {
	write(outputDir: string, outputFileName?: string): Promise<void>
}

export type DirContent =
	// & { '.': WriteableDir }
	{ [key: string]: AnyWriteable<unknown> | WriteableDir }
