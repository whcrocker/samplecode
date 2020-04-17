package com.cmmps.wordcalc;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.ConcurrentHashMultiset;
import com.google.common.collect.Multiset;
import com.google.common.collect.Sets;

/**
 * This program will count words in a file or list of files. The "topN" used
 * words will be printed along with the word count. The topN value is supplied
 * along with a list of files and/or directories. If a directory is specified,
 * all files and subdirectories will be processed recursively. At least one file
 * or directory is required. Non-existent and non-accessible files and/or
 * directories will be skipped. Symbolic links are not processed.
 * 
 * Usage: WordCalc <N> [<file ... dir ... file>]
 * 
 * @author henry
 *
 */
public class WordCalc {
    private static Logger logger = Logger.getLogger(WordCalc.class);

    private static final String VERSION = "1.0.0";

    private static final String USAGE = "\nUsage: WordCalc <topN> <[path ...]>\n\n"
                    + "The words will be counted in all files and directories (recursively) provided.\n"
                    + "The 'topN' words and counts will be printed.  The 'topN' value is required \n"
                    + "along with at least one file or directory path.  Non-existent and non-accessible \n"
                    + "files and/or directories will be skipped.  Symbolic links are not processed.\n";

    // used to sort data by highest count they by word, i.e. if counts are equal,
    // orders by word
    private static final Comparator<Multiset.Entry<String>> BY_COUNT_BY_WORD = new Comparator<Multiset.Entry<String>>() {
        public int compare(Multiset.Entry<String> e1, Multiset.Entry<String> e2) {
            int countCompare = e2.getCount() - e1.getCount();

            return (countCompare == 0 ? e1.getElement().compareTo(e2.getElement()) : countCompare);
        }
    };

    // max number of threads to use for file processing
    private static final int MAX_THREADS = 10;

    /**
     * WordCnt entry point.
     * 
     * Assumptions: symbolic links are not followed
     * 
     * @param String[] args - command line arguments - minimum of two args where #1
     *                 is value for number of words to print and the balance
     *                 represent files and/or directories to search.
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        WordCalcContext context = null;
        Multiset<String> words = null;
        int status = 0;

        try {
            context = buildContext(args);

            if (context != null) {
                logger.info("WordCalc Command Line Arguments:\n" + context.toString());

                // read all the words
                words = countWords(context);

                // sort the words for display
                Set<Multiset.Entry<String>> entriesSortedByCount = Sets.newTreeSet(BY_COUNT_BY_WORD);
                entriesSortedByCount.addAll(words.entrySet());

                // display the required information
                System.out.println();
                int itemCnt = 0;
                for (Multiset.Entry<String> entry : entriesSortedByCount) {
                    if (++itemCnt <= context.getTopn()) {
                        System.out.println(entry.getElement() + " occurred " + entry.getCount() + " times");
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                System.out.println("Failed to create file context object.  Words cannot be counted.");
                status = -1;
            }
        }
        catch (Exception e) {
            System.out.println("An error occurred while processing files.");
            logger.error("An error occurred while processing.", e);

            status = -2;
        }
        finally {
            if (status == 0) {
                StringBuilder msg = new StringBuilder("\nWordCnt version " + VERSION + " completed in "
                                + (System.currentTimeMillis() - start) + " ms\n");

                msg.append("     Files Processed:\t" + (context != null ? context.getPaths().length : 0) + "\n");
                msg.append("     Unique Words:\t" + (words != null ? words.elementSet().size() : 0) + "\n");
                msg.append("     Total Words:\t" + (words != null ? words.size() : 0) + "\n");

                System.out.println(msg);
                logger.info(msg);
            }

            System.exit(status);
        }
    }

    /**
     * Check the arguments array for the correct number and verify the first
     * argument is an integer.
     * 
     * @param String[] args - command line arguments
     * 
     * @return boolean - true if more than one argument exists and the first
     *         argument is a positive integer; otherwise, false
     */
    private static boolean checkArgs(String[] args) {
        boolean retval = false;
        int argCnt = (args != null ? args.length : 0);

        if (argCnt > 1) {
            String firstArg = args[0];

            // the first arg must be a positive integer
            try {
                int topn = Integer.parseInt(firstArg);

                if (topn < 1) {
                    System.out.println("ERROR: the 'topN' parameter [" + topn + "] must be a positive integer.");
                    logger.error("The 'topN' argument [" + topn + "] is not a valid positive integer.");
                }
                else {
                    retval = true;
                }
            }
            catch (Exception e) {
                System.out.println("ERROR: could not convert 'topN' parameter [" + firstArg + "] to an integer value.");
                logger.error("The 'topN' argument [" + firstArg + "] could not be converted to an integer.");
            }
        }
        else {
            System.out.println("ERROR: missing arguments.");
            logger.error("Invalid number of arguments were provided.");
        }

        if (!retval) {
            System.out.println(USAGE);
        }

        return retval;
    }

    private static WordCalcContext buildContext(String[] args) {
        return (checkArgs(args)
                        ? new WordCalcContext(Integer.parseInt(args[0]), ArrayUtils.subarray(args, 1, args.length))
                        : null);
    }

    @SuppressWarnings("unchecked")
    private static Multiset<String> countWords(WordCalcContext ctx) {
        Multiset<String> words = ConcurrentHashMultiset.create();

        if (ctx != null) {
            // this will contain a list of paths to process by the thread
            Object[] threadPaths = new Object[MAX_THREADS];

            // split the work up among threads - do not exceed MAX_THREADS
            int maxIndex = (MAX_THREADS - 1);
            int index = 0;
            for (Path path : ctx.getPaths()) {
                List<Path> pathList = (List<Path>) threadPaths[index];

                if (pathList == null) {
                    pathList = new ArrayList<Path>();
                }

                pathList.add(path);
                threadPaths[index] = pathList;

                index = (index >= maxIndex ? 0 : (index + 1));
            }

            // the number of threads needed will be determined by number of non-null array
            // items
            List<Thread> threads = new ArrayList<>();
            for (Object o : threadPaths) {
                if (o != null) {
                    Thread t = new Thread(new Worker((List<Path>) o, words));
                    t.start();
                    threads.add(t);
                }
            }

            logger.debug("Threads Started: " + threads.size());

            // now wait until all threads are finished
            for (Thread t : threads) {
                try {
                    t.join();
                }
                catch (Exception e) {
                    logger.error("Thread join caused and error.", e);
                }
            }
        }

        logger.debug("Distinct Words: " + words.elementSet().size() + "  Total Words: " + words.size());

        return words;
    }
}
