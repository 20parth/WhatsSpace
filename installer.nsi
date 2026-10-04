Unicode true

!define APP_NAME      "WhatsSpace"
!define APP_VERSION   "0.1.0"
!define APP_EXE       "WhatsSpace.exe"
!define INSTALL_DIR   "$PROGRAMFILES64\WhatsSpace"
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\WhatsSpace"

Name "${APP_NAME} ${APP_VERSION}"
OutFile "dist\WhatsSpace-Setup.exe"
InstallDir "${INSTALL_DIR}"
InstallDirRegKey HKLM "${UNINSTALL_KEY}" "InstallLocation"
RequestExecutionLevel admin
SetCompressor /SOLID lzma
BrandingText "WhatsSpace v${APP_VERSION} · parthrb.dev"

; ── Pages ───────────────────────────────────────────────────────────────────
Page directory
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

; ── Installer ───────────────────────────────────────────────────────────────
Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*.*"

  ; Desktop shortcut
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"

  ; Start Menu shortcut
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut  "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"  "$INSTDIR\${APP_EXE}"
  CreateShortcut  "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk"    "$INSTDIR\Uninstall.exe"

  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Add/Remove Programs entry
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "DisplayName"      "${APP_NAME}"
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "DisplayVersion"   "${APP_VERSION}"
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "Publisher"        "Parth Bhawar"
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "URLInfoAbout"     "https://parthrb.dev"
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "InstallLocation"  "$INSTDIR"
  WriteRegStr   HKLM "${UNINSTALL_KEY}" "UninstallString"  '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoModify"         1
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoRepair"         1
SectionEnd

; ── Uninstaller ─────────────────────────────────────────────────────────────
Section "Uninstall"
  RMDir  /r "$INSTDIR"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir  /r "$SMPROGRAMS\${APP_NAME}"
  DeleteRegKey HKLM "${UNINSTALL_KEY}"
SectionEnd
