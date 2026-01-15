## IMGConverter

This application enables users to upload images via file picker or drag-and-drop and convert them to grayscale using Python in the browser via Pyodide. The application can be accessed from [GitHub Pages](https://yogeeswar2001.github.io/img-converter).

### Technical Design
I used React, Material UI, Pyodide for building the application.

- Why React?
    - React hooks enable automatic UI updates when application state changes such as tracking uploaded images, managing the grayscale conversion process, and toggling loading indicators.
    - Simplifies state management and improves maintainability compared to manually handling DOM updates and state in vanilla JavaScript.
    - As React is component based scales cleanly as features are added without increasing code complexity.

- Why Material UI?
    - Provides pre-built, accessible, and responsive components such as Button, Grid, Paper, and Typography.
    - Enables for fast UI development by using the existing components while giving professional look and feel.
    - A common theme can be created using MUI’s ThemeProvider to define colors, typography, and layout behavior in one place in Index.js file, this simplifies design updates by changing styles centrally rather than per component.

- JavaScript–Python bridge is provided by Pyodide library. The Pillow library processes the image and performs grayscale conversion.

- UI state management
    - React state tracks the original image, grayscale image, loading state, and selected download format.
    - Conditional rendering ensures UI elements appear only when relevant (e.g., converted image shown after processing).
    - Loading indicators provide user feedback during image conversion.

- File validation and error handling
    - Common validation logic is shared between file input and drag and drop handlers. Only supports image formats (JPG, JPEG, PNG) are accepted, this revents runtime errors caused by unsupported files or canceled file selection.

### UI Design considerations
- To make the UI intuitive I developed a single page application which minimizes the amount of navigation needed.
- I also added a info banner below the header for the users to understand how to use the web application.
- The Convert button is disabled until an image is actually uploaded and also disabled when the image conversion is being processed , preventing accidental clicks.

<img src="https://github.com/yogeeswar2001/img-converter/blob/main/doc-imgs/imgconverter-wireframe.png" alt="IMGConverter Wireframe" width="300" height="400">