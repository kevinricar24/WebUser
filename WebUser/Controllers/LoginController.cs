using System;
using System.Text;
using System.Web.Mvc;
using WebUser.Models;

namespace WebUser.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>  
        /// Update User Information  
        /// </summary>  
        /// <param name="user"></param>  
        /// <returns></returns>  
        public string Login_User(User user)
        {
            if (user != null)
            {
                using (DatabaseEntities Obj = new DatabaseEntities())
                {
                    foreach (var users in Obj.Users)
                    {

                        byte[] passwordByte = users.Password;
                        string converted = Encoding.UTF8.GetString(passwordByte).Replace('\0', ' ');
                        string password = converted.Trim();

                        if (users.Email.Equals(user.Email) && password.Equals(user.Username))
                        {
                            bool Active = Convert.ToBoolean(users.Status);
                            if (Active)
                            {
                                return "Login Satifactorio !!";
                            }
                            return "Usuario Inactivo !!";
                        }
                    }
                    return "Usuario No existente !!";
                }
            }
            else
            {
                return "No Existen Usuarios";
            }
        }

    }
}