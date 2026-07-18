import argostranslate.package

print("Updating package index...")
argostranslate.package.update_package_index()

available_packages = argostranslate.package.get_available_packages()

languages = [

    # English ↔ Hindi
    ("en", "hi"),
    ("hi", "en"),

    # English ↔ Spanish
    ("en", "es"),
    ("es", "en"),

    # English ↔ French
    ("en", "fr"),
    ("fr", "en"),

    # English ↔ German
    ("en", "de"),
    ("de", "en"),

    # English ↔ Italian
    ("en", "it"),
    ("it", "en"),

    # English ↔ Portuguese
    ("en", "pt"),
    ("pt", "en"),

    # English ↔ Russian
    ("en", "ru"),
    ("ru", "en")

]

for source, target in languages:

    package = next(
        (
            p for p in available_packages
            if p.from_code == source and p.to_code == target
        ),
        None
    )

    if package:

        print(f"Installing {source} -> {target}...")

        download_path = package.download()

        argostranslate.package.install_from_path(download_path)

        print("Done")

    else:

        print(f"Model not found: {source} -> {target}")

print("\nInstallation Completed.")