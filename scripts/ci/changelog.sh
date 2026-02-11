#!/usr/bin/env bash
GIT_LOG_NUM=1

ICON_UPDATE=$(git log -$GIT_LOG_NUM --pretty=%B | grep -E '^(iconupdate)' || true)
ICON_ADD=$(git log -$GIT_LOG_NUM --pretty=%B | grep -E '^(iconadd)' || true)
ICON_REMOVE=$(git log -$GIT_LOG_NUM --pretty=%B | grep -E '^(iconremove)' || true)

HEAD_LINE=$(head -n 4 CHANGELOG.md)
echo "$(tail -n +5 CHANGELOG.md)" > CHANGELOG.md
OLD_VERSION=$(jq -r .version package.json)

# Calculate NEW_VERSION by incrementing patch version
IFS='.' read -r major minor patch <<< "$OLD_VERSION"
NEW_VERSION="$major.$minor.$((patch + 1))"

jq --arg v "$NEW_VERSION" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json
HEAD_LINES=$'\n\n## ['"$NEW_VERSION"'](https://github.com/ZebraDevs/zeta-icons/compare/zeta-icons-'"$OLD_VERSION"'...zeta-icons-'"$NEW_VERSION"') ('"$(date +'%Y-%m-%d')"')'

GITHUB_IMG_URL=https://raw.githubusercontent.com/ZebraDevs/zeta-icons/refs/heads/main/outputs/png/

if [ -n "$ICON_ADD" ]; then
  HEAD_LINES+=$'\n\n### ✅ Icons Added\n\n'
  ICON_ADD_LINES=""
  while read -r line; do
    [ -z "$line" ] && continue
    CATEGORY=$(echo "$line" | sed -n 's/^iconadd(\(.*\)):.*/\1/p')
    ICON_NAME=$(echo "$line" | sed -n 's/^iconadd([^)]*):[[:space:]]*\(.*\)$/\1/p')
    FILE_NAME=$(echo "$ICON_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
    ICON_ADD_LINES+="* **$CATEGORY:** $ICON_NAME <img src='${GITHUB_IMG_URL}${FILE_NAME}_round.png' alt='$ICON_NAME'  width='24px' height='24px'/>"
  done <<< "$ICON_ADD"
  HEAD_LINES="$HEAD_LINES$ICON_ADD_LINES"
fi

if [ -n "$ICON_UPDATE" ]; then
  HEAD_LINES+=$'\n\n### 🎨 Icons Updated\n\n'
  ICON_UPDATE_LINES=""
  while read -r line; do
    [ -z "$line" ] && continue
    CATEGORY=$(echo "$line" | sed -n 's/^iconupdate(\(.*\)):.*/\1/p')
    ICON_NAME=$(echo "$line" | sed -n 's/^iconupdate([^)]*):[[:space:]]*\(.*\)$/\1/p')
    FILE_NAME=$(echo "$ICON_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
    ICON_UPDATE_LINES+="* **$CATEGORY:** $ICON_NAME <img src='${GITHUB_IMG_URL}${FILE_NAME}_round.png' alt='$ICON_NAME' width='24px' height='24px'/>"

  done <<< "$ICON_UPDATE"
  HEAD_LINES="$HEAD_LINES$ICON_UPDATE_LINES"
fi

if [ -n "$ICON_REMOVE" ]; then
  HEAD_LINES+=$'\n\n### ✂️ Icons Removed\n\n'
  ICON_REMOVE_LINES=""
  while read -r line; do
    [ -z "$line" ] && continue
    CATEGORY=$(echo "$line" | sed -n 's/^iconremove(\(.*\)):.*/\1/p')
    ICON_NAME=$(echo "$line" | sed -n 's/^iconremove([^)]*):[[:space:]]*\(.*\)$/\1/p')
  ICON_REMOVE_LINES+="* **$CATEGORY:** $ICON_NAME"$'\n'
  done <<< "$ICON_REMOVE"
  HEAD_LINES="$HEAD_LINES$ICON_REMOVE_LINES"
fi

touch cmt_msg.tmp
echo "$HEAD_LINES" > cmt_msg.tmp

{ echo "$HEAD_LINE$HEAD_LINES"; cat CHANGELOG.md; } > CHANGELOG.md.tmp
mv CHANGELOG.md.tmp CHANGELOG.md