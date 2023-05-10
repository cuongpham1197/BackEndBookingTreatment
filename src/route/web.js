import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import staffController from "../controllers/staffController";
import customerController from '../controllers/customerController';
import treatmentController from '../controllers/treatmentController';
import shopController from '../controllers/shopController';

let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displaygetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);


    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllcode);

    router.get('/api/top-staff-home', staffController.getTopStaffHome);

    router.get('/api/get-all-staffs', staffController.getAllStaff);
    router.post('/api/save-infor-staffs', staffController.postInforStaff);
    router.get('/api/get-detail-staff-by-id', staffController.getDetailStaffById);
    router.post('/api/bulk-create-schedule', staffController.bulkCreateSchedule);
    router.get('/api/get-schedule-staff-by-date', staffController.getScheduleByDate);
    router.get('/api/get-extra-infor-staff-by-id', staffController.getExtraInforStaffById);
    router.get(`/api/get-profile-staff-by-id`, staffController.getProfileStaffById);
    router.get('/api/get-list-customer-for-staff', staffController.getListCustomerForStaff);
    router.post('/api/send-treatment-detail', staffController.sendTreatmentDetail);

    router.post('/api/customer-book-appointment', customerController.postBookAppointment);
    router.post('/api/verify-book-appointment', customerController.postVerifyBookAppointment);

    router.post('/api/create-new-treatment', treatmentController.createNewTreatment);
    router.get('/api/get-treatment', treatmentController.getAllTreatment);
    router.get('/api/get-detail-treatment-by-id', treatmentController.getDetailTreatmentById);
    router.put('/api/edit-treatment-by-id', treatmentController.handleEditTreatment);

    router.post('/api/create-new-shop', shopController.createShop);
    router.get('/api/get-shop', shopController.getAllShop);
    router.get('/api/get-detail-shop-by-id', shopController.getDetailShopById);


    return app.use("/", router);
}

module.exports = initWebRoutes;