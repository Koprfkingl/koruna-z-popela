# Koruna z popela

Temná fantasy hra pro dospělé ve stylu komiksů Franka Millera. Máš vlastní postavu se statistikami: 4 rasy a 4 povolání. Zkoušky se hází na d20 a souboje jsou tahové s družinou. Na cestě tě čekají intriky, vražda krále, romance a 9 různých konců.

## Ke stažení

V sekci **Releases** jsou hotové soubory:

- **Android:** `koruna-z-popela-<verze>.apk`. Stáhni ho do telefonu a otevři. Poprvé je potřeba povolit instalaci z neznámých zdrojů.
- **Windows:** `koruna-z-popela-<verze>-setup.exe`. Instalačka se zeptá, kam hru dát, a vytvoří zástupce na ploše. Při prvním spuštění ji Windows SmartScreen označí jako neznámou: klikni na „Další informace“ a pak „Přesto spustit“.

Na Windows přepne F11 celou obrazovku. Hra se ukládá automaticky a má i tři ruční sloty.

## Nová verze

1. Uprav hru ve složce `www/hra/`. Celý příběh je v souborech `s0_prolog.js` až `s3_finale.js`. Návrh světa je v [NAVRH.md](NAVRH.md).
2. Zvyš `version` v `package.json`.
3. Pushni tag, třeba `git tag v1.0.1 && git push --tags`.

GitHub Actions pak sestaví APK i instalačku a přiloží je k novému vydání. Pokud chceš soubory bez vydání, spusť ručně Actions → „Sestavení aplikací“ → Run workflow. Najdeš je pak jako artefakty běhu.

## Podpis pro Android

Bez nastavení se sestaví ladicí (debug) APK. Funguje normálně, jen se další verze nenainstaluje přes tu starou. Starou je potřeba nejdřív odinstalovat, a tím se smaže uložená hra.

Aby šly aktualizace instalovat přes sebe, vytvoř si jednou podpisový klíč. Nastavuje se v repozitáři: Settings → Secrets and variables → Actions. Postup:

```bash
keytool -genkeypair -keystore release.jks -alias hra -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.jks   # výstup vlož jako ANDROID_KEYSTORE_BASE64
```

Pak přidej tyhle tři secrets:
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD` (heslo z keytool)
- `ANDROID_KEY_ALIAS` (tady `hra`)

Soubor `release.jks` si dobře schovej a nedávej ho do repozitáře.

## Struktura

| Cesta | Co tam je |
| --- | --- |
| `www/hra/core.js` | engine: postava, kostky, souboje, ukládání |
| `www/hra/ink.js`, `cast.js`, `places.js` | kresba: portréty, postavy, 24 míst |
| `www/hra/s*.js` | příběh, scéna po scéně |
| `electron/` | obal pro Windows |
| `android/` | projekt pro Android (Capacitor) |
| `assets/icon.png` | ikona aplikace |
| `.github/workflows/build.yml` | automatické sestavení |
