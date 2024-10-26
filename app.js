const fs = require("fs");
const path = require("path");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Membuat Folder Baru
// "make-folder" : "node index.js make-folder",
app.makeFolder = () => {
    rl.question("Masukkan nama folder: ", (folderName) => {
        fs.mkdir(path.join(__dirname, folderName), (err) => {
            if (err) throw err;
            console.log("Folder telah berhasil dibuat!");
            rl.close();
        });
    });
};

// Membuat File Baru
// "make-file" : "node index.js make-file",
app.makeFile = () => {
    rl.question("Masukkan nama folder: ", (folder) => {
        rl.question("Masukkan nama file: ", (fileName) => {
            rl.question("Masukkan ekstensi file: ", (ext) => {
                rl.question("Masukkan isi file: ", (content) => {
                    fs.writeFileSync(path.join(folder, `${fileName}.${ext}`), content);
                    console.log(`File ${fileName}.${ext} telah berhasil dibuat di folder ${folder}`);
                    rl.close();
                });
            });
        });
    });
};

// Membaca Isi Folder
// "read-folder" : "node index.js read-folder",
app.readFolder = () => {
    rl.question("Masukkan nama folder yang ingin dibaca: ", (folderName) => {
        const folderPath = path.join(__dirname, folderName);
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err;

            const fileDetails = files.map((file) => {
                const stats = fs.statSync(path.join(folderPath, file));
                return {
                    namaFile: file,
                    extensi: path.extname(file).substring(1),
                    jenisFile: ['jpg', 'png'].includes(path.extname(file).substring(1)) ? 'gambar' : 'text',
                    tanggalDibuat: stats.birthtime.toISOString().split('T')[0],
                    ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`
                };
            });

            console.log(JSON.stringify(fileDetails, null, 2));
        });
        rl.close();
    });
};

// Membaca Isi File
// "read-file" : "node index.js read-file"
app.readFile = () => {
    rl.question("Masukkan nama file yang ingin dibaca (jika file di dalam folder contoh input: image/gambar.jpg): ", (fileName) => {
        const filePath = path.join(__dirname, fileName);
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error:", err.message);
                return;
            }
            console.log(`Isi dari file ${fileName}:\n\n${data}`);
        });
        rl.close();
    });
};

// Meryortir File Sesuai Ekstensi
// "ext-sorter" : "node index.js ext-sorter",
app.extSorter = () => {
    const unorganizedFolder = path.join(__dirname, 'unorganize_folder');

    fs.readdir(unorganizedFolder, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            const ext = path.extname(file).substring(1);
            const targetFolder = ['jpg', 'png'].includes(ext) ? 'image' : 'text';

            const targetPath = path.join(__dirname, targetFolder);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }

            fs.rename(
                path.join(unorganizedFolder, file),
                path.join(targetPath, file),
                (err) => {
                    if (err) throw err;
                    console.log(`${file} telah berhasil dipindahkan ke folder ${targetFolder}`);
                }
            );
        });
    });
};

module.exports = app;