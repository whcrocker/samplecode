package com.cmmps.wordcalc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

/**
 * Stores the current context of the WordCalc execution.  This class is immutable.
 * @author henry
 *
 */
public class WordCalcContext {
   private static Logger logger = Logger.getLogger(WordCalcContext.class);
   
   private int topn;
   private String[] pathNames;
   private List<Path> paths;
   
   public WordCalcContext(int topn, String[] pathNames) {
      this.topn = topn;
      this.pathNames = (pathNames == null ? new String[] {} : pathNames);
      convertPathsToFilenames();
   }
   
   @Override
   public String toString() {
      return Util.getGson().toJson(this);
   }

   /**
    * Process the path values and verifies the file or directory exists.  If the path represents a directory, process
    * all files and subdirectories (recursively).  The end result will be a list of fully qualified files to be processed
    * by the WordCalc program.  Non-existent and non-accessible files/directories are skipped.
    */
   private void convertPathsToFilenames() {
      paths = new ArrayList<Path>();
      
      for (String pathName : pathNames) {
         Path path = Paths.get(pathName);
         
         if (Files.exists(path) && Files.isReadable(path)) {
            if (Files.isDirectory(path)) {
               List<Path> walkList = new ArrayList<>();
               ReadableFilter readableFilter = new ReadableFilter(walkList);
               
               try {
                   // this should only contain files that are readable
                   Files.walkFileTree(path, readableFilter);
               
                   logger.debug("Files found for path '" + pathName + "': " + walkList.size());
                   
                   paths.addAll(walkList);
                   logger.info("Files to be processed -\n" + Util.getGson().toJson(paths));
               }
               catch (Exception e) {
                  String msgSuffix = "directory '" + pathName + "'.  Files for that directory will not be included.";
                  logger.error("An error occurred while processing " + msgSuffix, e);
                  System.out.println("ERROR: processing failed for " + msgSuffix);
               }
            }
            else {
                paths.add(path);
            }
         }
         else {
            System.out.println("WARN: File/Directory represented by path '" + path + "' doesn't exist or is not readable.");
         }
      }
      
      logger.debug("Total number of files to count: " + paths.size());
   }
   
   public int getTopn() {
      return topn;
   }

   public String[] getPathNames() {
      return pathNames;
   }
   
   public Path[] getPaths() {      
      return paths.toArray(new Path[paths.size()]);
   }
}
