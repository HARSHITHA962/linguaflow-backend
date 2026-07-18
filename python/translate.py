import sys
import json
import argostranslate.package
import argostranslate.translate

text = sys.argv[1]
source = sys.argv[2]
target = sys.argv[3]

installed_languages = argostranslate.translate.get_installed_languages()

from_lang = next((l for l in installed_languages if l.code == source), None)
to_lang = next((l for l in installed_languages if l.code == target), None)

if from_lang is None or to_lang is None:
    print(json.dumps({
        "error": "Language model not installed"
    }))
    sys.exit()

translation = from_lang.get_translation(to_lang)

print(json.dumps({
    "translatedText": translation.translate(text)
}))