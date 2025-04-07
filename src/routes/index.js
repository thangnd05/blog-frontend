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



const publicRoutes = [
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
    { path: routes.admin, component: Admin, noContainer: true },
    { path: routes.adminUser, component: User, noContainer: true },
    { path: routes.adminPost, component: AdminPost , noContainer: true},
    { path: routes.adminComment, component: AdminComment, noContainer: true },
    { path: routes.updatePost, component: Update },
    { path: routes.updateComment, component: CommentUpdate },
    { path: routes.userPost, component: PostProFile , noContainer: true},
    { path: routes.userComment, component: CommentProFile , noContainer: true},
    { path:routes.categoryDetails, component:CategoryDetails, noContainer: true},
    {path:routes.adminCategory,component:CategoryAdmin, noContainer: true},
    {path:routes.createCategory, component:CreateCategory},
    {path:routes.errorAdmin,component:ErrorAdminPage},
    {path:routes.reset,component:ResetPassWord},
    {path:routes.forgot,component:ForgotPassword},
    {path:routes.policy,component:Policy},
    {path:routes.service,component:Service},
    {path:routes.profile,component:InfoProfile, noContainer: true},
    {path:routes.changePassword,component:ChangePassword}






];

export default publicRoutes;

    















// ]

// export default publicRoutes;