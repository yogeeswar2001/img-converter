import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Paper,
  Grid,
} from "@mui/material";

function App() {
  const [pyodide, setPyodide] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [grayImage, setGrayImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // initialize Pyodide and load pillow lib
  useEffect(() => {
    const loadPyodide = async () => {
      const py = await window.loadPyodide();
      await py.loadPackage(["pillow"]);
      setPyodide(py);
    };
    loadPyodide();
  }, []);

  // Reads the selected image and stores it as Base64 string 
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result);
      setGrayImage(null);
    };
    reader.readAsDataURL(file);
  };

  // method to handle drag and drop of image files
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // convert the uploaded image to grayscale using python with pyodide
  const convertToGray = async () => {
    if (!pyodide || !originalImage) return;

    setLoading(true);
    pyodide.globals.set("input_image", originalImage);

    const pythonCode = `
from PIL import Image
import base64, io

header, encoded = input_image.split(",", 1)
image_bytes = base64.b64decode(encoded)

img = Image.open(io.BytesIO(image_bytes)).convert("L")

buffer = io.BytesIO()
img.save(buffer, format="PNG")

encoded_result = base64.b64encode(buffer.getvalue()).decode("utf-8")
"data:image/png;base64," + encoded_result
`;

    const result = await pyodide.runPythonAsync(pythonCode);
    setGrayImage(result);
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            IMGConverter
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            border: "2px dashed #1976d2",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Typography variant="body1" mb={2}>
            Drag & drop an image here or select a file
          </Typography>

          <Button variant="contained" component="label">
            Choose File
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </Button>
        </Paper>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={convertToGray}
            disabled={!originalImage || loading}
          >
            {loading ? "Converting..." : "Convert to Grayscale"}
          </Button>
        </Box>

        <Grid container spacing={3} mt={3} justifyContent="center">
          {originalImage && (
            <Grid item>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width={320}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Original Image
                  </Typography>

                  <img
                    src={originalImage}
                    alt="original"
                    style={{ maxWidth: 300 }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {grayImage && (
            <Grid item>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width={320}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Grayscale Image
                  </Typography>

                  <img
                    src={grayImage}
                    alt="grayscale"
                    style={{ maxWidth: 300 }}
                  />

                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    href={grayImage}
                    download="grayscale.png"
                  >
                    Download
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          backgroundColor: "#f0f0f0",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          IMGConverter @ 2026, By yogeeswar
        </Typography>
      </Box>
    </Box>
  );
}

export default App;