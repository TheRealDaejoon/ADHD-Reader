I am trying to make an adhd reader.

AIMS:
- make the first few letters of every word bold, the number of bold letters will depend on the length of the word.
- change the font to a more readable font
- has to be a chrome extension (this is because I assume most users will use it on websites and also you can open
documents with chrome browser and one of my aims is to 'translate' documents too

Update 02/10/2024:
I have changed the python to Javascript and have got a working version of the chrome extension, so right now it can
make everything Arial font (good!!) and also make everything bold using the same technique (Okay but i obviously 
need to find a way to make the program iterate through every word in the whole document which may be quite labour 
intensive but ill cross that bridge when i get to it.
So the chrome extension can do that but I also have a version of the Javascript translation of my python algorithm
and that works so I just need to combine the document iteration with my algorithm so that it can change every word.
This is where the walktheDOM technique apparently works but i'm going to research it more later.

TODO:
Crockford's walktheDOM technique
