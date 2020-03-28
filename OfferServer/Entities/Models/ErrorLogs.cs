using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class ErrorLogs
    {
        public Guid Oid { get; set; }
        public string ErrorContext { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorSource { get; set; }
        public string StackTrace { get; set; }
        public string Detail { get; set; }
        public string ErrorType { get; set; }
        public string Tag { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
