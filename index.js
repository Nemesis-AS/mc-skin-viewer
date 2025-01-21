function main() {
    document.getElementById("usernameForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("usernameInput").value;

        fetchSkin(username);
    });
}

async function fetchSkin(username) {
    try {
        showLoader();
        const res = await fetch("https://api.ashcon.app/mojang/v2/user/" + username);
        if(res.status != 200) {
            throw new Error("An error occurred while fetching skin!");
        }

        const json = await res.json();
        const skinUrl = json.textures.skin.url;

        if (!skinUrl) {
            throw new Error("No skin found!");
        }
        changeTexture(skinUrl);
    } catch(err) {
        alert("An error occurred while fetching skin!");
        console.error(err);
    } finally {
        hideLoader();
    }
}

async function changeTexture(textureUrl) {
    const viewer = document.getElementById("viewer");
    const material = viewer.model.materials[0];
    const textureObj =  await viewer.createTexture(textureUrl);
    material.pbrMetallicRoughness.baseColorTexture.setTexture(textureObj);
        
    const scene = viewer[Object.getOwnPropertySymbols(viewer).find(e => e.description === 'scene')];
    
    let character;
    scene.traverse((obj) => {
        if (obj.isMesh && obj.name === "Head") // @todo! Find a better way to get the character
            character = obj;
    });

    const texture = character.material.map;
    texture.minFilter = 1003; // THREE.NearestFilter
    texture.magFilter = 1003; // THREE.NearestFilter

}

function showLoader() {
    document.getElementById("loaderOverlay").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loaderOverlay").classList.add("hidden");
}

window.onload = main;
