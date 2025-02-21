import './utils/axiosConfig';

//
// Add your custom directory structure as documented:
// ├── ...
// ├── functions
// |   └── api
// │       ├── [[path]].[ts|js]
// │       ├── [username]
// │       │   └── profile.[ts|js]
// │       ├── time.[ts|js]
// │       └── todos
// │           ├── [[path]].[ts|js]
// │           ├── [id].[ts|js]
// │           └── index.[ts|js]
// └── ...
//
// The following routes will be generated based on the file structure, mapping the URL pattern to the /functions file that will be invoked:
//
// /api/time => ./functions/api/time.ts
// /api/todos => ./functions/api/todos/index.ts
// /api/todos/* => ./functions/api/todos/[id].ts
// /api/todos/*/** => ./functions/api/todos/[[path]].ts
// /*/profile => ./functions/api/[username]/profile.ts
// /** => ./functions/api/[[path]].ts

// Add your code here:
//
