document.getElementById("itemForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const response = await fetch("/upload", {
        method: "POST",
        body: formData,
    });
    if (response.ok) {
        loadItems();
    }
});

async function loadItems() {
    const response = await fetch("/items");
    const items = await response.json();
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="/uploads/${item.image}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p>Price: ₹${item.price}</p>
            <button onclick="buyItem(${item.id})">Buy</button>
        `;
        itemList.appendChild(card);
    });
}

function buyItem(itemId) {
    window.location.href = `/purchase/${itemId}`;
}

loadItems();
