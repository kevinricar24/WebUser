using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebUser.Models;

namespace WebUser.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>  
        ///   
        /// Get All User
        /// </summary>  
        /// <returns></returns>  
        public JsonResult Get_AllUser()
        {
            using (DatabaseEntities Obj = new DatabaseEntities())
            {
                List<User> Emp = Obj.Users.ToList();
                return Json(Emp, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>  
        /// Get User With Id  
        /// </summary>  
        /// <param name="Id"></param>  
        /// <returns></returns>  
        public JsonResult Get_UserById(string Id)
        {
            using (DatabaseEntities Obj = new DatabaseEntities())
            {
                int UserId = int.Parse(Id);
                return Json(Obj.Users.Find(UserId), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>  
        /// Insert New User  
        /// </summary>  
        /// <param name="User"></param>  
        /// <returns></returns>  
        public string Insert_User(User user)
        {
            if (user != null)
            {
                using (DatabaseEntities Obj = new DatabaseEntities())
                {
                    foreach (var users in Obj.Users)
                    {
                        if (users.Username.Equals(user.Username))
                        {
                            return "Alerta, Ya existe este usuario en la base de datos\nNo se guardará el usuario";
                        }
                    }
                    Obj.Users.Add(user);
                    Obj.SaveChanges();
                    return "Usuario agregado satisfactoriamente!!";
                }
            }
            else
            {
                return "Usuario no agregado! Intente de nuevo";
            }
        }

        public string ActionUser(string Action, User user)
        {
            string message = string.Empty;
            if (user != null)
            {
                using (DatabaseEntities Obj = new DatabaseEntities())
                {
                    var user_ = Obj.Entry(user);
                    User UserObj = Obj.Users.Where(x => x.Id == user.Id).FirstOrDefault();
                    if (Action.Equals("actualizado"))
                    {
                        UserObj.Username = user.Username;
                        UserObj.Password = user.Password;
                        UserObj.Sex = user.Sex;
                        UserObj.Email = user.Email;
                        UserObj.ModificationDate = DateTime.Now;
                        Obj.SaveChanges();
                        message = "Usuario actualizado satisfactoriamente!!";
                    }
                    else if (Action.Equals("eliminado"))
                    {
                        UserObj.Status = false;
                        UserObj.ModificationDate = DateTime.Now;
                        Obj.SaveChanges();
                        message = "User eliminado satisfactoriamente!!";
                    }
                }
            }
            else
            {
                message = "Usuario no " + Action + "! Intente de nuevo";
            }
            return message;
        }

        /// <summary>  
        /// Update User Information  
        /// </summary>  
        /// <param name="user"></param>  
        /// <returns></returns>  
        public string Update_User(User user)
        {
            return ActionUser("actualizado", user);
        }


        /// <summary>  
        /// Delete User Information  
        /// </summary>  
        /// <param name="user"></param>  
        /// <returns></returns>  
        public string Delete_User(User user)
        {
            return ActionUser("eliminado", user);
        }
    }
}