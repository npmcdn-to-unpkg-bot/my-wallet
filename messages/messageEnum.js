/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var statusEnum = require(global.pathTo('/messages/statusEnum.js'));

module.exports = {
    
    // GET Message
    get: function( eNum ){
        if (typeof this[ eNum ] !== 'undefined'){
            return this[ eNum ];
        } else {
            return {
                message: eNum,
                code: 500
            };
        }
    },
    
    // TRANSACTIONS
    ERROR_TRANSACTIONS_INVALID_ID_PARAM: { message: 'Parâmetro usuário é inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_WALLET_PARAM: { message: 'Parâmetro carteira é inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_SEARCH_QUERY: { message: 'Parâmetro de pesquisa inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_PAGE: { message: 'Page argument must be an integer', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_LIST_SIZE: { message: 'Items per page argument must be an integer and lower or equals 100', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_SORT_PARAM: { message: 'Sort argument must be a string', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_ID_PARAM: { message: 'Referência da transação inválida', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_DESCRIPTION_PARAM: { message: 'Parâmetro Descrição inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_AMMOUNT_PARAM: { message: 'Parâmetro Quantia inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_DATE_PARAM: { message: 'Parâmetro Data inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_USER_PARAM: { message: 'Parâmetro User inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_LIST_PARAM: { message: 'Parâmetro Lista inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_INVALID_TRANSACTION_PARAM: { message: 'Parâmetro Transação inválido', code: statusEnum.BAD_REQUEST },
    ERROR_TRANSACTIONS_FAILURE_ON_REMOVE: { message: 'Falha ao remover transação', code: statusEnum.ERROR },
    ERROR_TRANSACTIONS_FAILURE_ON_SAVE_TRANSACTION: { message: 'Falha ao salvar transação', code: statusEnum.ERROR },
    ERROR_TRANSACTIONS_NOT_FOUND: { message: 'Transação não encontrada', code: statusEnum.ERROR },
    
    // WALLETS
    ERROR_WALLETS_INVALID_SEARCH_QUERY: { message: 'Search query must be a string', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_PAGE: { message: 'Page argument must be an integer', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_LIST_SIZE: { message: 'Items per page argument must be an integer and lower or equals 100', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_SORT: { message: 'Sort argument must be a string', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_ID_PARAM: { message: 'Referência da carteira inválida', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_NAME_PARAM: { message: 'Parâmetro Nome inválido', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_INVALID_USER_PARAM: { message: 'Parâmetro User inválido', code: statusEnum.BAD_REQUEST },
    ERROR_WALLETS_FAILURE_ON_SEARCH_LISTS: { message: 'Falha ao pesquisar listas', code: statusEnum.ERROR },
    ERROR_WALLETS_FAILURE_ON_CLEAR_TRANSACTIONS_RELATIONSHIP: { message: 'Falha ao remover transactions', code: statusEnum.ERROR },
    ERROR_WALLETS_FAILURE_ON_REMOVE_LIST: { message: 'Falha ao remover transaction', code: statusEnum.ERROR },
    ERROR_WALLETS_FAILUTE_ON_REMOVE_TRANSACTION: { message: 'Falha ao remover transaction', code: statusEnum.ERROR },
    ERROR_WALLETS_FAILURE_ON_ADD_TRANSACTION: { message: 'Falha ao adicionar transação', code: statusEnum.ERROR },
    ERROR_WALLETS_FAILURE_ON_SAVE_LIST: { message: 'Falha ao salvar carteira', code: statusEnum.ERROR },
    
    // LISTS
    ERROR_LISTS_INVALID_SEARCH_QUERY: { message: 'Search query must be a string', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_PAGE: { message: 'Page argument must be an integer', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_LIST_SIZE: { message: 'Items per page argument must be an integer and lower or equals 100', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_SORT: { message: 'Sort argument must be a string', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_ID_PARAM: { message: 'Referência da lista inválida', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_NAME_PARAM: { message: 'Parâmetro Nome inválido', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_INVALID_USER_PARAM: { message: 'Parâmetro User inválido', code: statusEnum.BAD_REQUEST },
    ERROR_LISTS_FAILURE_ON_SEARCH_LISTS: { message: 'Falha ao pesquisar listas', code: statusEnum.ERROR },
    ERROR_LISTS_FAILURE_ON_CLEAR_TRANSACTIONS_RELATIONSHIP: { message: 'Falha ao remover transactions', code: statusEnum.ERROR },
    ERROR_LISTS_FAILURE_ON_REMOVE_LIST: { message: 'Falha ao remover transaction', code: statusEnum.ERROR },
    ERROR_LISTS_FAILUTE_ON_REMOVE_TRANSACTION: { message: 'Falha ao remover transaction', code: statusEnum.ERROR },
    ERROR_LISTS_FAILURE_ON_ADD_TRANSACTION: { message: 'Falha ao adicionar transação', code: statusEnum.ERROR },
    ERROR_LISTS_FAILURE_ON_SAVE_LIST: { message: 'Falha ao salvar lista', code: statusEnum.ERROR },
    
    
    // USERS
    ERROR_USERS_INVALID_ID: { message: 'A referência de identificação do usuário é inválida!', code: statusEnum.BAD_REQUEST },
    ERROR_USERS_INVALID_NAME: { message: 'Nome inválido!', code: statusEnum.BAD_REQUEST },
    ERROR_USERS_INVALID_EMAIL: { message: 'Email inválido!', code: statusEnum.BAD_REQUEST },
    ERROR_USERS_INVALID_PASSWORD: { message: 'Senha inválida!', code: statusEnum.BAD_REQUEST },
    
    ERROR_USERS_FAILURE_ON_REMOVE_TRANSACTIONS: { message: 'Falha ao remover as transações do usuário', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_REMOVE_WALLETS: { message: 'Falha ao remover as carteiras do usuário', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_REMOVE_LISTS: { message: 'Falha ao remoer as listas do usuário', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_REMOVE_AUTH: { message: 'Falha ao remover as contas do usuário', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_REMOVE_USER: { message: 'Falha ao remover o registro do usuário', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_SAVE_DATA: { message: 'Falha ao salvar informações', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_UPDATE_EMAIL: { message: 'Falha ao autalizar email', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_CHANGE_PASSWORD: { message: 'Falha ao alterar senha', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_ADD_ACCOUNT: { message: 'Falha ao adicionar conta', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_SET_PRIMARY_ACCOUNT: { message: 'Falha ao selecionar conta primária', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_SEARCH_USER: { message: 'Falha ao pesquisar usuários', code: statusEnum.ERROR },
    ERROR_USERS_FAILURE_ON_INSERT_USER: { message: 'Falha ao registrar usuário', code: statusEnum.ERROR },
    ERROR_USERS_EMAIL_IS_NOT_AVAILABLE: { message: 'O email informado não está disponível', code: statusEnum.ERROR },
    ERROR_USERS_ALREADY_EXISTS: { message: 'Usuário já existente!', code: statusEnum.ERROR },
    
    // SESSION
    ERROR_SESSION_INVALID_CREDENTIALS: { message: 'Sessão expirada', code: statusEnum.FORBIDEN },
    ERROR_SESSION_EXPIRED: { message: 'Sessão expirada', code: statusEnum.UNAUTHORIZED },
    ERROR_SESSION_MISSING_EMAIL: { message: 'Você precisa informar um email', code: statusEnum.FORBIDEN },
    ERROR_SESSION_MISSING_PASSWORD: { message: 'Você precisa informar uma senha', code: statusEnum.FORBIDEN },
 
    // API reposnse
    SUCCESS: { message: 'Success', code: statusEnum.SUCCESS },
    CREATED: { message: 'Created', code: statusEnum.CREATED },
    BAD_REQUEST: { message: 'Bad Request: The request is malformed, the body does not parse', code: statusEnum.BAD_REQUEST },
    UNAUTHORIZED: { message: 'Unauthorized: You need to be authenticated to access this', code: statusEnum.UNAUTHORIZED },
    FORBIDEN: { message: 'Forbidden: You don\'t have permission to access this. This incident will be reported', code: statusEnum.FORBIDEN },
    ERROR_API_ROUTE_NOT_FOUND: { message: 'Not Found: This route do not exists', code: statusEnum.NOT_FOUND },
    ERROR_API_ROUTE_IS_GONE: { message: 'Gone: This route was no longer valid', code: statusEnum.GONE }
};