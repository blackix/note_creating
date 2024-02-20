

let lastFocusedPostit = null; // Variabile per tenere traccia dell'ultimo post-it focalizzato

$(function() {
    const postitColors = ["postit-ocre", "postit-fucsia", "postit-cielo", "postit-tortora", "postit-acido"];

    // Rimuove il vecchio bottone di aggiunta colonna se presente
    $("#addColumnBtn").remove();

    // Aggiunge il bottone di aggiunta colonna al board
    const addColumnButton = $('<button id="addColumnBtn">+</button>').appendTo("#board");
    addColumnButton.click(function() {
        addColumn();
    });

    function addColumn() {
        const newColumnNumber = $("#board .column").length + 1;
        const colorClass = postitColors[(newColumnNumber - 1) % postitColors.length];
        const column = $(`<div class="column" id="column${newColumnNumber}">
                            <input class="column-title" value="Colonna ${newColumnNumber}">
                          </div>`).appendTo("#board");
    
        // Crea un post-it iniziale nella nuova colonna
        addPostit(column, colorClass);
      //  makeColumnSortable();

    
        // Rendi la colonna ridimensionabile
        column.resizable({
            handles: 'e', // Handle solo sul lato destro
            maxWidth: 300 // Larghezza massima di 300px
        });
    }
    
    // Modifica per catturare gli eventi keydown dai post-it
    $("#board").on("keydown", ".postit", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const colorClass = $(this).attr('class').split(' ').pop();
            addPostit($(this).parent(), colorClass);
        }
    });
function addPostit(column, colorClass, focus = true) {
    const postitContainer = $('<div class="postit-container"></div>');
    const postit = $(`<textarea class="postit ${colorClass}"></textarea>`);
    const completeIcon = $('<span class="complete-task">&#10003;</span>'); // Usa un carattere come icona di esempio
    
    postit.appendTo(postitContainer);
    completeIcon.appendTo(postitContainer); // Aggiungi l'icona al contenitore del post-it
    postitContainer.appendTo(column);
    
    if (focus) {
        postit.focus();
    }
// Dopo l'aggiunta di una nuova colonna o post-it
makeColumnSortable();

    // Gestisci il click sull'icona di completamento
    completeIcon.click(function() {
        const completedDeck = $("#completed-tasks");
        postitContainer.detach().appendTo(completedDeck); // Sposta il contenitore del post-it nel deck dei completati
    });
}


    $(document).on('focus', '.postit', function() {
        lastFocusedPostit = this; // Aggiorna l'ultimo post-it focalizzato
    });

    // Crea la prima colonna automaticamente all'avvio
    addColumn();
});


$(document).ready(function() {

    $('#font-select').change(function() {
        if(lastFocusedPostit) {
            $(lastFocusedPostit).css('font-family', $(this).val());
        }
    });
    
    $('#font-weight').change(function() {
        var value = $(this).val();
        if (lastFocusedPostit) {
            // Resetta lo stile per gestire correttamente le modifiche
            $(lastFocusedPostit).css('font-style', 'normal').css('text-decoration', 'none').css('font-weight', 'normal');
            
            switch (value) {
                case "underline":
                    $(lastFocusedPostit).css('text-decoration', value);
                    break;
                case "italic":
                    $(lastFocusedPostit).css('font-style', value);
                    break;
                case "bold":
                    $(lastFocusedPostit).css('font-weight', value);
                    break;
            }
        }
    });
    
    $('#color-picker').change(function() {
        if(lastFocusedPostit) {
            $(lastFocusedPostit).css('color', $(this).val());
        }
    });

    $('#font-size-increase').click(function() {
        if(lastFocusedPostit) {
            let currentSize = parseInt($(lastFocusedPostit).css('font-size'));
            currentSize++; // Incrementa di 1px
            $(lastFocusedPostit).css('font-size', currentSize + 'px');
            $('#font-size-input').val(currentSize); // Aggiorna l'input con il nuovo valore
        }
    });

    // Decrementa la dimensione del font
    $('#font-size-decrease').click(function() {
        if(lastFocusedPostit) {
            let currentSize = parseInt($(lastFocusedPostit).css('font-size'));
            currentSize = Math.max(currentSize - 1, 1); // Evita dimensioni negative o nulle
            $(lastFocusedPostit).css('font-size', currentSize + 'px');
            $('#font-size-input').val(currentSize); // Aggiorna l'input
        }
    });

    // Opzionale: gestisce i cambiamenti manuali dell'input per la dimensione del font
    $('#font-size-input').change(function() {
        if(lastFocusedPostit) {
            let newSize = $(this).val();
            $(lastFocusedPostit).css('font-size', newSize + 'px');
        }
    });
    $('#project-name').on('input', function() {
        // Qui potresti aggiornare il titolo del progetto dove necessario
        // Ad esempio, modificare il titolo della pagina
        document.title = $(this).val();
    });
});

function makeColumnSortable() {
    $(".column").sortable({
        items: ".postit", // Specifica quali elementi possono essere ordinati
        cancel: ".fixed", // Esclude eventuali elementi che non vuoi siano trascinabili
        placeholder: "postit-placeholder", // Classe CSS per lo spazio riservato durante il trascinamento
        containment: "parent", // Limita il trascinamento all'interno del genitore
        axis: "y", // Limita il trascinamento verticalmente
        update: function(event, ui) {
            // Opzionale: callback eseguito dopo che l'ordine degli elementi è cambiato
        }
    });
}

// Chiama questa funzione ogni volta che aggiungi una nuova colonna o un nuovo post-it

$('.complete-task').click(function() {
    const completedDeck = $("#completed-tasks");
    const postitContainer = $(this).closest('.postit-container');
    
    // Calcola il nuovo z-index basato sul numero di post-it nel deck
    const newIndex = completedDeck.children().length + 1;
    
    postitContainer.css({
        'z-index': newIndex, // Imposta lo z-index per mantenere l'ordine di sovrapposizione
        'right': 10 + newIndex * 5 + 'px', // Sposta leggermente a destra per l'effetto sovrapposto
        'bottom': 10 + newIndex * 2 + 'px' // Sposta leggermente verso l'alto per l'effetto sovrapposto
    });
    
    completedDeck.append(postitContainer); // Sposta il post-it nel deck dei completati
});