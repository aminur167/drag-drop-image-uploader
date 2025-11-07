const DragArea = document.querySelector(".AppBody"),
      DragText = DragArea.querySelector("h3"),
      button = DragArea.querySelector("button"),
      input = DragArea.querySelector("input"),
      preview = document.getElementById("preview");

let MyFiles = [];  // এখন multiple files রাখার জন্য array ব্যবহার করবো

// button click -> input click
button.onclick = () => input.click();

// input change event (file selected by browse)
input.addEventListener("change", function() {
    handleFiles(this.files);
});

// drag over
DragArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    DragArea.classList.add("active", "dragover");
    DragText.textContent = "Release to Upload Files";
});

// drag leave
DragArea.addEventListener("dragleave", () => {
    DragArea.classList.remove("dragover");
    DragText.textContent = "Drag & Drop Images Here";
});

// drop event
DragArea.addEventListener("drop", (event) => {
    event.preventDefault();
    DragArea.classList.remove("dragover");
    handleFiles(event.dataTransfer.files);
});

// ফাইলগুলো প্রসেস ও ভ্যালিডেশন করবে
function handleFiles(files) {
    const validEx = ["image/jpeg", "image/jpg", "image/png"];
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    
    let newFiles = [...files];
    let allValid = true;

    for(let file of newFiles) {
        if(!validEx.includes(file.type)) {
            alert("দয়া করে শুধুমাত্র JPEG, JPG, PNG ইমেজ ফাইল আপলোড করুন।");
            allValid = false;
            break;
        }
        if(file.size > maxFileSize) {
            alert(`ফাইলের সাইজ ২ মেগাবাইট এর বেশি হতে পারবে না: ${file.name}`);
            allValid = false;
            break;
        }
    }

    if(!allValid) {
        DragArea.classList.remove("active");
        DragText.textContent = "Drag & Drop Images Here";
        return;
    }

    // নতুন ফাইলগুলো MyFiles এর সাথে যোগ করো
    MyFiles = MyFiles.concat(newFiles);

    DragArea.classList.add("active");
    DragText.textContent = "Uploaded Successfully!";

    updatePreview();
}

// প্রিভিউ আপডেট করবে
function updatePreview() {
    preview.innerHTML = ""; // আগে যা ছিল মুছে ফেলো

    MyFiles.forEach((file, index) => {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            let imgUrl = fileReader.result;

            let imgWrapper = document.createElement("div");
            imgWrapper.classList.add("img-wrapper");

            let img = document.createElement("img");
            img.src = imgUrl;

            let removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-btn");
            removeBtn.innerHTML = "&times;"; // × চিহ্ন
            removeBtn.title = "Remove this image";

            // রিমুভ বাটনে ক্লিক করলে ছবিটা ডিলিট হবে
            removeBtn.onclick = () => {
                MyFiles.splice(index, 1);
                updatePreview();

                // যদি সব ছবি মুছে যায়, স্টেট রিসেট করো
                if(MyFiles.length === 0) {
                    DragArea.classList.remove("active");
                    DragText.textContent = "Drag & Drop Images Here";
                }
            };

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            preview.appendChild(imgWrapper);
        };

        fileReader.readAsDataURL(file);
    });
}
