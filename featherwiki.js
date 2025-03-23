document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.getElementById('content');
    const fileName = 'FeatherWiki_Meadowlark.html';
    
    // Verificar si el archivo existe
    async function checkFileExistence() {
        try {
            await puter.fs.stat(fileName);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Descargar el archivo
    async function downloadFile() {
        const response = await fetch('https://feather.wiki/builds/v1.8.x/FeatherWiki_Meadowlark.html');
        if (!response.ok) throw new Error('Failed to download file');
        
        const blob = await response.blob();
        const fileContent = await blob.text();
        return fileContent;
    }

    // Guardar cambios al cerrar
    async function saveOnClose() {
        const updatedContent = contentDiv.innerHTML;
        await puter.fs.write(fileName, updatedContent);
        console.log('Cambios guardados al cerrar.');
    }

    try {
        const fileExists = await checkFileExistence();
        
        if (!fileExists) {
            const fileContent = await downloadFile();
            await puter.fs.write(fileName, fileContent);
            console.log('Archivo descargado y guardado.');
        }

        const file = await puter.fs.read(fileName);
        contentDiv.innerHTML = await file.text();

        // Guardar cambios automáticamente al detectar input
        contentDiv.addEventListener('input', async () => {
            const updatedContent = contentDiv.innerHTML;
            await puter.fs.write(fileName, updatedContent);
            console.log('Cambios guardados.');
        });

        // Guardar cambios al cerrar
        puter.ui.onWindowClose(saveOnClose);

    } catch (error) {
        contentDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        console.error('Error general:', error);
    }
});