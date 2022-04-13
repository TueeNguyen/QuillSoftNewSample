# Running the application:

### GROBID 
- Download GROBID by following these instructions: https://grobid.readthedocs.io/en/latest/Install-Grobid/ 
- For Windows machine, Grobid version 0.6.0 must be used as the later versions do not support non-UNIX based machines.
- Run GROBID service in the background from the command line:
   - Change to your local GROBID directory: ``` cd C:/path/to/grobid ```
   - Run gradlew: ``` gradlew run ```

### ENGINE
- Get the latest version of the engine from https://github.com/pherriton/quillsoft-nlp-engine
- (Preferably) using Visual Studio Code, open the editor and run the program using Flask. 
    - Check the built-in terminal to verify that "Controllers.SummarizationController.py" is running using Flask

### VIEWER
- Get the latest version of the viewer here or from https://github.com/pherriton/quillsoft-nlp-jviewer
- Open an IDE, (preferably) Visual Studio Code.
- Change directory to nextjs-client: ```cd nextjs-client``` 
- Run the client: ``` npm run dev```, which should open up a local server in the browser (localhost:3000)
