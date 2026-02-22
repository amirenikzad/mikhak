// USER
export const GET_USER_NO_ADMIN = '/user/non_admin/all_get';

// USER_INFO
export const GET_LOGGED_USER_INFO = '/user_info_get';
export const PUT_LOGGED_USER_INFO = '/user_info_put';

// USER
export const GET_ALL_USER = '/user/all_get';
export const PUT_USER = '/user_put';
export const PUT_PASSWORD = '/password_put';
export const PUT_PASSWORD_ADMIN = '/password_admin_put';
export const GET_USER = '/user_get';
export const POST_USER = '/user_post';
export const DELETE_USER = '/user_delete';
export const POST_ACTIVE_USER = '/active_user_delete';

// ROLES
export const GET_ALL_ROLES = '/role/all_get';
export const PUT_ROLE = '/role_put';
export const POST_ROLE = '/role_post';
export const DELETE_ROLE = '/role_delete';

// PERMISSIONS
export const GET_ALL_PERMISSIONS = '/permission/all_get';
export const PUT_PERMISSIONS = '/permission_put';
export const POST_PERMISSIONS = '/permission_post';
export const DELETE_PERMISSIONS = '/permission_delete';
export const DELETE_DEFAULT_PERMISSIONS = '/default_permission_post';

// ROLES_PERMISSIONS
export const GET_ALL_ROLES_PERMISSIONS = '/role_permission/all_get';
export const GET_ROLE_PERMISSIONS = '/role_permission_get';
export const POST_ROLES_PERMISSIONS = '/role_permission_post';
export const DELETE_ROLES_PERMISSIONS = '/role_permission_delete';
export const DELETE_ALL_ROLES_PERMISSIONS = '/role_permissions/all_delete';

// USER_ROLE
export const GET_ALL_USER_ROLE = '/user_role/all_get';
export const GET_USER_ROLE = '/user_role_get';
export const GET_USERS_ROLE = '/users_role_get';
export const POST_USER_ROLE = '/user_role_post';
export const DELETE_USER_ROLE = '/user_role_delete';
export const DELETE_ALL_USER_ROLE = '/user_roles/all_delete';

// MICROSERVICE (API)
export const GET_ALL_FUNCTIONALITIES = '/functionalities/all_get';
export const GET_FILTER_FUNCTIONALITIES = '/functionalities/filter_get';
export const PUT_FUNCTIONALITIES = '/functionality_put';
export const POST_FUNCTIONALITIES = '/functionality_post';
export const DELETE_FUNCTIONALITIES = '/functionality_delete';

// Organization
export const GET_ALL_ORGANIZATION = '/organization/all_get';
export const PUT_ORGANIZATION = '/organization_put';
export const DELETE_ORGANIZATION = '/organization_delete';
export const POST_ORGANIZATION = '/organization_post';
export const GET_ORGANIZATION_HIERARCHY = '/organization/hierarchy_get';
export const POST_ALL_QAMUS_ENTITY = '/qamus/entity/all_post';

// ORGANIZATION_USER
export const GET_ALL_ORGANIZATION_USER = '/organization_user/all_get';
export const GET_ORGANIZATION_USER = '/organization_user_get';
export const GET_ORGANIZATIONS_USER = '/organizations_user_get';
export const POST_ORGANIZATION_USER = '/organization_user_post';
export const DELETE_ORGANIZATION_USER = '/organization_user_delete';
export const DELETE_ALL_ORGANIZATION_USER = '/organization_users/all_delete';

// WALLET
export const PUT_CHARGE_WALLET = '/charge_wallet_put';
export const GET_WALLET = '/wallet_get';

// USERS_WALLET
export const GET_ALL_USERS_WALLET = '/users_wallet/all_get';
export const PUT_AMOUNT = '/amount_put';
export const PUT_SUSPEND = '/suspend_put';

// TRANSACTION
export const GET_TRANSACTION_USERS_WALLET = '/transaction_users_get';
export const GET_TRANSACTION = '/transaction_get';

// SERVICE
export const GET_ALL_SERVICES = '/services/all_get';
export const POST_SERVICE = '/service_post';
export const PUT_SERVICE = '/service_put';
export const DELETE_SERVICE = '/service_delete';
export const POST_SERVICE_COMPONENT_MICROSERVICE = '/service_component_api_post';
export const GET_SERVICE_COMPONENT_MICROSERVICE = '/service_component_api_get';
export const GET_ALL_DISTINCT_SERVICE = '/distinct_service/all_get';
export const PUT_SERVICE_COMPONENT_MICROSERVICE = '/service_component_api_put';
export const PATCH_SERVICE = '/service_forsell';

// SERVICE_USER_ORGANIZATION
export const GET_ALL_SERVICE_USER_ORGANIZATION = '/service_user_organization/all_get';
export const GET_SERVICE_USER_ORGANIZATION = '/service_user_organization_get';
export const GET_ORGANIZATION_SERVICE_USER = '/organization_service_user_get';
export const GET_USER_SERVICE_ORGANIZATION = '/user_service_organization_get';
export const POST_SERVICE_USER_ORGANIZATION = '/service_user_organization_post';
export const DELETE_SERVICE_USER_ORGANIZATION = '/service_user_organization_delete';

// Gift_Card
export const GET_ALL_GIFT_CARD = '/gift_card/all_get';

// TICKET
export const GET_ALL_TICKET = '/ticket/all_get';
export const GET_TICKET_CHAT = '/ticket/chat_get';
export const POST_TICKET_CHAT = '/ticket/chat_post';
export const GET_TICKET_CLOSE = '/ticket/close_get';
export const GET_TICKET_COUNT = '/ticket/count_get';

// DASHBOARD
export const GET_ACTIVE_USERS = '/active_users_get';
export const GET_ADMIN_USERS = '/admin_users_get';
export const GET_COUNT_ACTIVE_ORGANIZATIONS = '/count_active_organizations_get';
export const GET_SUM_USED_WALLET = '/sum_used_wallets_get';
export const GET_SUM_CHARGED_WALLET = '/sum_charged_wallets_get';
export const GET_ACTIVE_SERVICE_COUNT = '/active_service/count_get';
export const GET_TOP_TEN_USERS = '/top_ten_users_get';
export const GET_SUM_USER_WALLETS = '/sum_user_wallets_get';
export const GET_TRANSACTION_ALL_COUNT = '/transaction_all/count_get';
export const GET_ORGANIZATION_USERS_COUNT = '/organizations_users/count_get';
export const GET_HARDWARE_COUNT = '/hardware/count_get';

// Login
export const GET_LOGIN_HISTORY = '/login_history_get';

//  PLATFORM
export const GET_ALL_PLATFORM = '/platform/all_get';
export const PUT_PLATFORM = '/platform_put';
export const POST_PLATFORM = '/platform_post';
export const DELETE_PLATFORM = '/platform_delete';

//  PANEL
export const GET_ALL_PANEL = '/panel/all_get';
export const PUT_PANEL = '/panel_put';
export const POST_PANEL = '/panel_post';
export const DELETE_PANEL = '/panel_delete';

//  EDITION
export const GET_ALL_REDITION = '/edition/all_get';
export const PUT_EDITION = '/edition_put';
export const POST_EDITION = '/edition_post';
export const DELETE_EDITION = '/edition_delete';

//  CATEGORY
export const GET_ALL_CATEGORY = '/category/all_get';
export const PUT_CATEGORY = '/category_put';
export const POST_CATEGORY = '/category_post';
export const DELETE_CATEGORY = '/category_delete';