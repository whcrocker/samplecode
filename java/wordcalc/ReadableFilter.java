package com.cmmps.wordcalc;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;

import org.apache.log4j.Logger;

/**
 * Notify the user of files that will not be included by some other 'not readable' processing.  If a directory is not readable,
 * skip it - no need to waste effort.  Only accessible paths will be added to the return list.
 * 
 * @author henry
 *
 */
public class ReadableFilter extends SimpleFileVisitor<Path> {
   private static Logger logger = Logger.getLogger(ReadableFilter.class);
   
   private List<Path> pathsToReturn;
   
   public ReadableFilter(List<Path> pathsToReturn) throws VisitorFilterException {
      super();
      
      if (pathsToReturn != null) {
          this.pathsToReturn = pathsToReturn;
      }
      else {
         throw new VisitorFilterException("The pathsToReturn input parameter is null.  An object is required so the path values can be returned.");
      }
   }
   
   @Override
   public FileVisitResult visitFile(Path file, BasicFileAttributes attr) {
      if (attr.isRegularFile() && !Files.isReadable(file)) {
         System.out.println("WARNING: file '" + file + "' is not readable.  It will not be included.");
         logger.trace("Skipping file '" + file.toFile().getAbsolutePath() + "' because it is not readable.");
      }
      
      pathsToReturn.add(file);
      
      return FileVisitResult.CONTINUE;
   }
   
   @Override
   public FileVisitResult preVisitDirectory(Path file, BasicFileAttributes attr) {
      FileVisitResult result = FileVisitResult.CONTINUE;
      
      if (attr.isDirectory() && !Files.isReadable(file)) {
         System.out.println("WARNING: directory '" + file + "' is not readable.  It will not be included.");
         logger.trace("Skipping directory '" + file.toFile().getAbsolutePath() + "' because it is not readable.");
         result = FileVisitResult.SKIP_SUBTREE;
      }
            
      return result;
   }

   @Override
   public FileVisitResult visitFileFailed(Path file, IOException ioe) {
      System.out.println("ERROR: file '" + file + "' could not be accessed [" + ioe.getMessage() + "].  It cannot be included.");
      return FileVisitResult.CONTINUE;
   }

   public List<Path> getPathsToReturn() {
      return pathsToReturn;
   }
   
}
