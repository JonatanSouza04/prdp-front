const db = openDatabase("prodap1.db", '1.0', "Prd WebSQL Database", 2 * 1024 * 1024)


export async function db_create(SQL) {
	return new Promise((resolve, reject) => {

		db.transaction(
				 tx => {
					 tx.executeSql(SQL,[],
						
						function (resultSet){
							resolve(resultSet);
						},
					
					    function (transaction, error){
							reject(error);
						},
			       	);					
	
			     }, 
				  function(transaction, error) {
                      reject(error);
				  },
				  null
			 );
 
	});
}

export async function db_insert(SQL,Values) {

    return new Promise((resolve, reject) => {
 
           db.transaction(tx => {
                          tx.executeSql(SQL,Values, 
                             
                             function (resultSet){
                               resolve(resultSet);
                             },
                             
                             function (transaction, error){
                                  reject(error);
                             },
                         );
                      }
                   );
    });
 
 }


export async function db_select(SQL,Params) {

    return new Promise( async (resolve, reject) => {
     
           db.transaction(
               tx => {
                 tx.executeSql(SQL, Params, (_, { rows }) => {
                   resolve(rows);
                },
                 function (transaction, error){
                     reject(error);
                 }
                );
              }, null, null);
   });
 
 }	


 export async function db_exec(SQL,Params) {

      return new Promise((resolve, reject) => {
                 db.transaction(tx => {
                              tx.executeSql(SQL,Params, 
                                function (resultSet){
                                    resolve(resultSet);
                                  },
                                 function (transaction, error){
                                    reject(error);
                                 },
                              );
                });
       });
}
 

