# Privacy Boundary

Mischief Atlas is designed to hold intimate information. Its public source repository must never become the memory archive itself.

## Safe to commit

- Application source code
- Product and design documentation
- Synthetic fixtures
- Fictional people, places, memories, and passages created for testing
- Redacted screenshots containing no identifying content
- Public-domain or properly licensed assets
- Empty schemas and example environment files

## Never commit

- Real autobiographical memories or journals
- Names, contact details, birthdays, relationship notes, or People Palace exports
- Personal photographs, recordings, handwriting captures, or document scans
- User databases, backups, recall histories, or analytics exports
- Private prompts containing memory content
- API keys, tokens, cookies, credentials, private URLs, or environment files
- Copyrighted books, scripts, or passages beyond legally appropriate excerpts
- Production encryption keys or recovery material

## Development-data rule

All fixtures in this repository must be obviously synthetic. Use invented locations and people that cannot be mistaken for the user's actual history.

## Runtime principles

The implementation specification should address:

- Encryption in transit and at rest
- Clear separation between public application code and private user data
- Export and deletion
- Backup and recovery
- Least-privilege access
- Transparent AI processing boundaries
- A local-first option if feasible
- Protection of thumbnails, logs, caches, and generated mnemonic assets

## Before sharing a screenshot or bug report

Check visible text, image metadata, filenames, browser storage, URLs, logs, and network payloads. Replace real data with synthetic equivalents before posting.
