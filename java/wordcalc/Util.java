package com.cmmps.wordcalc;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public abstract class Util {
   private static Logger logger = Logger.getLogger(Util.class)
            ;
   private static Gson gson;
   
   /**
    * Using Gson to easily convert objects to strings.  Used for logging and toString methods
    * 
    * @return Gson - singleton object used throughout the application.
    */
   public static Gson getGson() {
      if (gson == null) {
         GsonBuilder builder = new GsonBuilder();
         
         // the Path adapter is needed to avoid StackOverflowException
         gson = builder.registerTypeHierarchyAdapter(Path.class, new PathAdapter()).create();
      }
      
      return gson;
   }
   
   /**
    * Reads the contents of a file into a string.
    * 
    * @param Path path - file to be read
    * 
    * @return String - contents of the file
    */
   public static String readFileToString(Path path) {      
      StringBuilder buf = new StringBuilder();
      
      if (path != null) {
           try (Stream<String> stream = Files.lines(path, StandardCharsets.UTF_8))
           {
               stream.forEach(s -> buf.append(s).append(" "));
           }
           catch (Exception e)
           {
               logger.error("Unable to access file " + (path != null ? path.toFile().getName() : "null"), e);
           }
      }
      
       return buf.toString();
   }

}
