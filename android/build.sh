#!/bin/bash
JAR=lib/json-20230227.jar
SRC=src/NotesCLI.java
OUT=.

echo "Compiling..."
javac -cp $JAR $SRC -d .

echo "Running..."
java -cp .:$JAR NotesCLI