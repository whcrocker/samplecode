package com.cmmps.wordcalc;

public class VisitorFilterException extends RuntimeException {

   private static final long serialVersionUID = 20190622;

   public VisitorFilterException() {
      super();
   }

   public VisitorFilterException(String arg0, Throwable arg1, boolean arg2, boolean arg3) {
      super(arg0, arg1, arg2, arg3);
   }

   public VisitorFilterException(String arg0, Throwable arg1) {
      super(arg0, arg1);
   }

   public VisitorFilterException(String arg0) {
      super(arg0);
   }

   public VisitorFilterException(Throwable arg0) {
      super(arg0);
   }

}
