<main class="scanlines">
    <form id="formario" action="index.php" method="post">
    <h1><a href="./"><span>Super</span><br>&lt;Form&gt;ario Bros.</a></h1> <?php
        if (isset($error)) {
            echo "<strong>$error</strong>";
        } ?>
        <fieldset>
            <legend>Load savegame</legend>
            <label for="code">Enter code <input id="code" name="code" type="text" maxlength="6" size="6" pattern="^[0-9a-zA-Z]*$" autofocus autocomplete="off"></label>
        </fieldset>
        <button>Load</button>
    </form>
</main>