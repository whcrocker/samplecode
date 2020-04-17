package com.cmmps.wordcalc;

import java.lang.reflect.Type;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * This is needed because converting Path to json throws a StackOverflowExeption.
 * 
 * @author henry
 *
 */
public class PathAdapter implements JsonDeserializer<Path>, JsonSerializer<Path> {

   @Override
   public Path deserialize(JsonElement jsonElement, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
      return Paths.get(jsonElement.getAsString());
   }

   @Override
   public JsonElement serialize(Path path, Type typeOfSrc, JsonSerializationContext context) {
      return new JsonPrimitive(path.toString());
   }

}
