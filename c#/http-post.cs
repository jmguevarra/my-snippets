[ValidateInput(false)]
        [HttpPost]
        public virtual JsonResult SendRetailerFeedback(JRM_RetailerFeedbackVM retailerFeedbackVM)
        {
            try
            {
                var test = "1";
                return Json(new { result = Constant.JSON_RESULT_OK, message = Constant.EMAIL_SEND_SUCCESS }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                var errMsg = $"{ex}";
                return Json(new { result = Constant.JSON_RESULT_ERROR, message = Constant.EMAIL_SEND_ERROR }, JsonRequestBehavior.AllowGet);
            }
        }