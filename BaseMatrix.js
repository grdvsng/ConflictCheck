/*  Role Matrix.
	
	Diction format - 
		'server_name': [{
			'system_name': {
				'role_1': [NoConflictRole1, NoConflictRole2, NoConflictRole3, ...],
				...
			},
		}, {
			...
		}]

*/

var BaseMatrix = {
	'192.168.1.1': {
		'ProductSale': {
			'Admin':         ['Store_Manager', 'Store_User', 'Store_Admin'],
			'Base_Admin':    ['Store_Manager', 'Store_User', 'Store_Admin'],
			'Store_Admin':   ['Store_Manager', 'Store_User'],
			'Store_Manager': ['Store_User', 'Store_Manager'],
			'Store_User':    []
		}
	}
}