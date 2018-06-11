
# [1.2]

- **BREAKING CHANGE** `buttonBG` and all variants of `fieldBG` have been removed
  in response to design updates to form inputs and buttons. Migration instructions
  are as follows:
  - `buttonBG`: Use `coolGrayLightTransp` instead.
  - `fieldBG`: Don't use this. Allow field backgrounds to fall back to defaults.
