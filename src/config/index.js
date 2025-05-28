
const routes = {


    home: '/',
    content: '/content',
    post: '/post',
    postDetail: '/post/:id',


    about: '/about',
    policy:'/policy',
    service:'/service',

    search: '/search/:searchValue',
    searchDetail: '/search/:searchValue/:id',
    error: '/error',

    login: '/login',
    register: '/register',
    forgot:"/forgot",
    reset:'/reset',

    admin: '/admin',
    adminUser: '/admin/user',
    adminPost: '/admin/post',
    adminComment: '/admin/comment',
    adminCategory :'/admin/category',
    createCategory :'/admin/createcategory',
    errorAdmin:'/error/page',
    
    updatePost: '/update/:postId',
    updateComment: '/updateComment/:commentId',

    changePassword:'/change-password',
    profile:'/profile',
    userPost: '/user/post',
    userComment: '/user/comment',
    categoryDetails :'/category/:categoryId',


    payment:'/payment',
    paymentResult:'/payment/result'


};

export default routes;
