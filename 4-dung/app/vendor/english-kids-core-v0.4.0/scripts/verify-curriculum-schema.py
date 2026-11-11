"""Optional independent validation with the curriculum author's supplied schema."""
import json
import sys
from pathlib import Path
from importlib.metadata import version
from jsonschema import Draft202012Validator
root = Path(__file__).resolve().parents[1]
variant = sys.argv[1] if len(sys.argv) > 1 else 'v5'
if variant not in ('v5', 'v7'):
    raise ValueError('Choose v5 or v7')
source = root / ('integration/fixtures/curriculum-v7-365.json' if variant == 'v7' else 'integration/fixtures/curriculum-v5-330.json')
schema_file = root / ('integration/fixtures/curriculum-schema-1.4.2.json' if variant == 'v7' else 'integration/fixtures/curriculum-schema-1.4.0.json')
schema = json.loads(schema_file.read_text())
Draft202012Validator.check_schema(schema)
errors = sorted(Draft202012Validator(schema).iter_errors(json.loads(source.read_text())), key=lambda e: str(e.path))
report = {'schema_valid': True, 'curriculum_valid': not errors, 'error_count': len(errors), 'validator': 'jsonschema', 'validator_version': version('jsonschema'), 'errors': [{'path': list(e.path), 'message': e.message} for e in errors]}
(root / ('verification/curriculum-schema-validation-v7.json' if variant == 'v7' else 'verification/curriculum-schema-validation.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
