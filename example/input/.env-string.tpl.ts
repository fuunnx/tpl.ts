import {config, args} from '../index';



// On peut simplement exporter une string, ça créera le contenu du fichier
export default `
COMPOSE_PROJECT_NAME=${config.prefix}-${args.target}

COMPOSE_FILE=${args.isLocal ? 'docker/docker-compose.yml' : 'docker-compose.yml'}

REALTY_HOSTNAME=${config.host}

${!args.isLocal ? `/stacks/storage/${config.prefix}-${args.target}` : ''}
`
