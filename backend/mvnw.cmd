@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper Executable Batch Script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%"=="" @ECHO off
@SETLOCAL EnableExtensions EnableDelayedExpansion

SET "EXEC_DIR=%CD%"
SET "WDIR=%~dp0"
IF NOT DEFINED MAVEN_BASEDIR SET "MAVEN_BASEDIR=%WDIR%"
IF "%MAVEN_BASEDIR:~-1%"=="\" SET "MAVEN_BASEDIR=%MAVEN_BASEDIR:~0,-1%"

SET "WRAPPER_JAR=%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
SET "WRAPPER_PROPERTIES=%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.properties"

IF NOT EXIST "%WRAPPER_PROPERTIES%" (
  ECHO Error: Could not find %WRAPPER_PROPERTIES%
  EXIT /B 1
)

IF NOT DEFINED JAVA_HOME (
  FOR %%I IN (java.exe) DO SET "JAVACMD=%%~$PATH:I"
) ELSE (
  SET "JAVACMD=%JAVA_HOME%\bin\java.exe"
)

IF NOT EXIST "%JAVACMD%" (
  ECHO Error: JAVA_HOME is not set and no 'java' command could be found in your PATH.
  EXIT /B 1
)

"%JAVACMD%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_BASEDIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
