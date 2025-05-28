import routes from '../config/index';
import Content from '~/pages/content';
import User from '~/Admin/user';
import Post from '~/pages/post';
import GetContent from '~/pages/content/post/getItem/getContent';
import About from '~/Layout/Intro';
import PageSearch from '~/pages/resultSearch';
import Error from '~/pages/resultSearch/SearchAll/error';
import AdminPost from '~/Admin/post';
import Login from '~/pages/user/login/login';
import Register from '~/pages/user/login/register';
import Admin from '~/Admin';
import Update from '~/pages/Update';
import CommentUpdate from '~/pages/Update/com';
import AdminComment from '~/Admin/comment';
import PostProFile from '~/pages/profile/post';
import CommentProFile from '~/pages/profile/comment';
import CategoryDetails from '~/pages/content/category/ButtonCategory';
import CategoryAdmin from '~/Admin/category';
import CreateCategory from '~/Admin/category/createCategory/category';
import ErrorAdminPage from './errorAdminPage';
import ResetPassWord from '~/pages/user/login/reset';
import ForgotPassword from '~/pages/user/login/forgot';
import Policy from '~/pages/poliService/policy';
import Service from '~/pages/poliService/service';
import InfoProfile from '~/pages/profile/info/info';
import ChangePassword from '~/pages/profile/info/change';
import PaymentMembership from '~/pages/profile/payment/paymentPro';
import PaymentResult from '~/pages/profile/payment/paymentResult';

export const publicRoutes = [
    { path: routes.home, component: Content },
    { path: routes.content, component: Content },
    { path: routes.post, component: Post },
    { path: routes.postDetail, component: GetContent },
    { path: routes.about, component: About },
    { path: routes.search, component: PageSearch },
    { path: routes.searchDetail, component: GetContent },
    { path: routes.error, component: Error },
    { path: routes.login, component: Login },
    { path: routes.register, component: Register },
    { path:routes.policy,component:Policy},
    { path:routes.service,component:Service},
    { path:routes.categoryDetails, component:CategoryDetails, noContainer: true},
    

];

export const privateRoutes=[
    { path: routes.admin, component: Admin, noContainer: true , requiredRole: 'ADMIN'},
    { path: routes.adminUser, component: User, noContainer: true , requiredRole: 'ADMIN'},
    { path: routes.adminPost, component: AdminPost , noContainer: true, requiredRole: 'ADMIN'},
    { path: routes.adminComment, component: AdminComment, noContainer: true, requiredRole: 'ADMIN' },
    { path: routes.updatePost, component: Update },
    { path: routes.updateComment, component: CommentUpdate },
    { path: routes.userPost, component: PostProFile , noContainer: true},
    { path: routes.userComment, component: CommentProFile , noContainer: true},
    { path:routes.adminCategory,component:CategoryAdmin, noContainer: true, requiredRole: 'ADMIN'},
    { path:routes.createCategory, component:CreateCategory, requiredRole: 'ADMIN'},
    { path:routes.reset,component:ResetPassWord},
    { path:routes.forgot,component:ForgotPassword},
    { path:routes.profile,component:InfoProfile, noContainer: true},
    { path:routes.changePassword,component:ChangePassword},
    { path:routes.errorAdmin,component:ErrorAdminPage},
    { path:routes.payment,component:PaymentMembership,noContainer: true},
    { path:routes.paymentResult,component:PaymentResult,noContainer: true}
]

export  default { publicRoutes, privateRoutes };

    


