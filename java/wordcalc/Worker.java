package com.cmmps.wordcalc;

import java.nio.file.Path;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Multiset;

/**
 * Does the heavy lifting for the file processing thread.  All instances of this thread will share the same structure
 * to store words.  Access is managed via a synchronized method.  The worker is immutable.
 * 
 * @author henry
 *
 */
public class Worker implements Runnable {
   private static Logger logger = Logger.getLogger(Worker.class);
   
   private static Multiset<String> words;
   private List<Path> paths;
   
   /**
    * Constructor that takes all parameters.  This creates an immutable object.
    * 
    * @param List<Path> paths - list of files this worker is to process
    * @param Multiset<String> words - used to store the words found by the worker threads - common to all workers
    */
   public Worker(List<Path> paths, Multiset<String> words) {
      this.paths = paths;
      initWords(words);
   }
   
   /**
    * Business end of the class - it processes all files assigned.  Processing means to break the file into words and
    * store the words in a structure for later analyzing.
    */
   @Override
   public void run() {
      if (CollectionUtils.isNotEmpty(paths) && words != null) {
         for (Path path : paths) {
            String fileAsString = Util.readFileToString(path).toLowerCase().trim();
            
            logger.trace("File Size of '" + path.toFile().getAbsolutePath() + "' : " + fileAsString.length());
            
            // split on whitespace
            for (String word : fileAsString.split("\\s+")) {
               updateWords(word);
            }
         }
      }
      else {
         logger.warn("Either the paths parameter is empty or the map is null.  The worker will not process any data.");
      }
   }

   /**
    * The words structure is a singleton for this class - once set, no need to set again.
    * 
    * @param Multiset<String> words - external structure to store words - created by the code creating threads
    */
   private static synchronized void initWords(Multiset<String> words) {
      if (Worker.words == null) {
         Worker.words = words;
      }
   }
   
   /**
    * Manages access to the words structure.  Only one thread at a time should add a word.
    * 
    * @param String word - word to be added to the structure
    */
   private static synchronized void updateWords(String word) {
      if (StringUtils.isNotEmpty(word)) {
         words.add(word);
      }
   }
}
