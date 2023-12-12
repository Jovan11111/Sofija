function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');

    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Use fetch to upload the file
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display the uploaded file name
            uploadStatus.innerText = `File uploaded: ${data.filename}`;

            // Download the modified file
            downloadFile(data.filename); // Make sure to pass the filename
        })
        .catch(error => {
            console.error('Error:', error);
            uploadStatus.innerText = 'Error uploading file';
        });
    }
}

function downloadFile(filename) {
    // Use fetch to download the file
    fetch(`/uploads/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Assuming the content is text, adjust if needed
        })
        .then(fileContents => {
            // dodaj razmak posle zareza ako ga već nema
            let modifiedContents = fileContents.replace(/,\s*/g, ', ');

            // dodaj razmak posle ., :, ;, -, ako već ne postoje
            modifiedContents = modifiedContents.replace(/([.:;-])(?!\s)/g, '$1 ');

            // ukloni velika slova I u sred rečenice
            modifiedContents = modifiedContents.replace(/(\bI\b)/g, (match) => match.toLowerCase());


            // Svaka rečenica treba da počne velikim slovom
            modifiedContents = modifiedContents.replace(/([.?!])\s*([a-z])/g, (_match, punctuation, group) => punctuation + ' ' + group.toUpperCase());

            // ukloni !!!..!! i zameni sa !
            modifiedContents = modifiedContents.replace(/!+/g, '!');

            // ukloni ??..?? i zameni sa ?
            modifiedContents = modifiedContents.replace(/\?+/g, '?');

            // ukloni "   ..   " i zameni sa " "
            modifiedContents = modifiedContents.replace(/ +/g, ' ');

            // Remove extra spaces before preserved periods // radi
            modifiedContents = modifiedContents.replace(/\s+\./g, '.');

            // text fajl može da počinje samo sa slovom ne ostalim glupostima
            while (/^[^a-zA-Z]/.test(modifiedContents)) { //radi
                modifiedContents = modifiedContents.substring(1);
            }

            // prvo slovo fajla je veliko
            modifiedContents = modifiedContents.replace(/^[a-z]/, (match) => match.toUpperCase());

            // sredi bulletpointe tako da budu odmakuni za tab i u novom redu
            modifiedContents = modifiedContents.replace(/([^\t])\-/g, '$1\n\t-');

            // Create a Blob with the modified content
            const blob = new Blob([modifiedContents], { type: 'text/plain' });

            // Create a link element and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle download error
        });
}


