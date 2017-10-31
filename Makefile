.PHONY: all
all: app.zip

app.zip: manifest.json icon*.png menu.js
	7z a $@ $^

.PHONY: clean
clean:
	rm -f app.zip
