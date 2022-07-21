// *================================================= Router.js, Deps ====================================================? //
const Router = require("express").Router
const { body } = require("express-validator")
// *=================== Controllers
const UserController = require("./controllers/userController")
const AdminController = require("./controllers/adminController")
const DiscountController = require("./controllers/discountController")
const VisitorController = require("./controllers/visitorController")
const EducatorController = require("./controllers/educatorController")
const LessonController = require("./controllers/lessonController")
const OrderController = require("./controllers/orderController")
const DisciplineController = require("./controllers/disciplineController")
// *=================== Middleware
const authMiddleware = require("../middleware/authMiddleware")
const rolesMiddleware = require("../middleware/rolesMiddleware")
// *=================== Router express
const router = new Router()

// *================================================= Routes(REST API) ===================================================? //
// *=================== Sign(user) routes
router.post(
  "/signup",
  body("phone").isNumeric().isLength({ min: 10, max: 12 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 24 }),
  UserController.signup,
) //* ({body: { phone, email, password, firstName, secondName, surname, maidenName }}) => { user, profile, accessToken, refreshToken }
router.post("/signin", UserController.signin) //* ({body: { phone, email, password }}) => { user, accessToken, profile }
router.post("/signout", authMiddleware, UserController.signout) //* () => {true}
router.get("/refresh", UserController.refresh) //* () => { user, accessToken, profile }
router.post("/mail", UserController.sendQuestion) //* ({body: { sender, message }}) => { mail }
router.post("/forgot", UserController.forgot) //* ({body: { email, link, password }}) => res.redirect(/signin/email)
router.get("/activate/:link", UserController.activate) //* ({params: { link }}) => res.redirect(/signin/email)
router.put("/users/:theme", authMiddleware, rolesMiddleware(["Admin", "Educator", "Visitor"]), UserController.changeTheme) //* ({params: {theme}}) => {user}
// *=================== Admin routes
router.get("/users/:id", authMiddleware, rolesMiddleware(["Admin"]), AdminController.getOneUser) //* ({params: {id}}) => {user}
router.get("/users", authMiddleware, rolesMiddleware(["Admin", "Educator"]), AdminController.getUsers) //* ({params: {count, skip}}) => [{users}]
router.get("/users/admin/:id", authMiddleware, rolesMiddleware(["Admin"]), AdminController.setAdmin) //* ({params: {id}}) => {user}
router.delete("/users/:id", authMiddleware, rolesMiddleware(["Admin"]), AdminController.deleteUser) //* ({params: {id}}) => { complete: true }
// *=================== Visitor routes
router.put("/visitor/:id", authMiddleware, rolesMiddleware(["Admin", "Visitor"]), VisitorController.updateVisitor) //* ({params: {id}, body: {update}}) => {visitor}
router.get("/visitor", authMiddleware, rolesMiddleware(["Admin", "Educator"]), VisitorController.getAllVisitors) //* ({params: count}) => [{visitors}]
router.get("/visitor/:id", authMiddleware, rolesMiddleware(["Admin", "Educator"]), VisitorController.getOneVisitor) //* ({params: {id}}) => {visitor}
// *=================== Educator routes
router.post("/educator", authMiddleware, rolesMiddleware(["Admin"]), EducatorController.createEducator) //* ({body: { id, firstName, secondName, surname, maidenName }}) => {educator}
router.get("/educator", authMiddleware, rolesMiddleware(["Admin", "Visitor"]), EducatorController.getAllEducators) //* ({params: count}) => [{educator}]
router.get("/educator/:id", authMiddleware, rolesMiddleware(["Admin", "Visitor"]), EducatorController.getOneEducator) //* ({params: {id}}) => {educator}
router.delete("/educator/:ld", authMiddleware, rolesMiddleware(["Admin"]), EducatorController.deleteEducator) //* ({params: {id}}) => {educators}
// *=================== Discipline routes
router.get("/discipline", authMiddleware, rolesMiddleware(["Admin", "Educator", "Visitor"]), DisciplineController.readManyDiscipline) //* ({params: count}) => [{discipline, schedule}]
router.post("/discipline", authMiddleware, rolesMiddleware(["Admin"]), DisciplineController.createDiscipline) //* ({body: { title, educator, duration, department, cron, course, masterclass, price, toolsPrice, onlinePrice, interval }}) => {discipline, schedule}
router.get("/discipline/:id", authMiddleware, rolesMiddleware(["Admin", "Educator", "Visitor"]), DisciplineController.readOneDiscipline) //* ({params: {id}}) => {discipline, schedule}
router.put("/discipline", authMiddleware, rolesMiddleware(["Admin"]), DisciplineController.updateOneDiscipline) //* ({body: { id, update }}) => {discipline, schedule}
router.put("/discipline/push", authMiddleware, rolesMiddleware(["Admin"]), DisciplineController.pushLessonToDiscipline) //* ({body: { id, schedule, interval }}) => {discipline, schedule}
router.put("/discipline/pull", authMiddleware, rolesMiddleware(["Admin"]), DisciplineController.pullLessonFromDiscipline) //* ({body: { id, schedule }}) => {discipline, schedule}
router.delete("/discipline/:id", authMiddleware, rolesMiddleware(["Admin"]), DisciplineController.deleteOneDiscipline) //* ({params: {id}}) => {discipline, schedule}
// *=================== Lesson routes
router.get("/lesson/:id", authMiddleware, rolesMiddleware(["Admin", "Educator", "Visitor"]), LessonController.getOneLesson) //* ({params: {id}}) => [{lesson}]
router.post("/lesson/sub", authMiddleware, rolesMiddleware(["Admin", "Visitor"]), LessonController.manageSubscription) //* ({body: { lessonId, visitorId, sub }}) => {lesson}
// *=================== Order routes
router.post("/order", authMiddleware, rolesMiddleware(["Visitor"]), OrderController.createOrder) //* ({body: { lesson, discount, prices }}) => {order}
router.get("/order", authMiddleware, rolesMiddleware(["Visitor"]), OrderController.getManyOrders) //* ({params: count}) => [{order}]
router.get("/order/:id", authMiddleware, rolesMiddleware(["Visitor"]), OrderController.getOneOrder) //* ({params: {id}}) => {order}
router.put("/order/:id", authMiddleware, rolesMiddleware(["Visitor"]), OrderController.changeOrder) //* ({params: {id}, body: update}) => {order}
router.delete("/order/:id", authMiddleware, rolesMiddleware(["Admin"]), OrderController.deleteOrder) //* ({params: {id}}) => {complete: true}
// *=================== Discount routes
router.post("/discount", authMiddleware, rolesMiddleware(["Admin"]), DiscountController.createDiscount) //* ({body: {visitor, type, expiresIn, trigger, value }}) => {discount}
router.get("/discount", authMiddleware, rolesMiddleware(["Admin"]), DiscountController.getAllDiscounts) //* ({params: count}) => {discount}
router.put("/discount/:id", authMiddleware, rolesMiddleware(["Visitor"]), DiscountController.activateDiscount) //* ({params: {id}, body: orderId}) => {discount}
router.delete("/discount/:id", authMiddleware, rolesMiddleware(["Admin"]), DiscountController.deleteDiscount) //* ({params: {id}}) => {complete:true}

module.exports = router
