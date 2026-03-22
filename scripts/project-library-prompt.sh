#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TEMPLATE_PATH="$SCRIPT_DIR/../prompts/adapt-library-from-current-project.md"

LIBRARY_NAME=${1:-المكتبة_الجديدة}
SOURCE_HINT=${2:-ضع_هنا_مسار_المصدر_المحلي_او_ملفات_الاستخراج}
OUTPUT_HINT=${3:-طبق_نفس_بنية_المشروع_الحالية_على_قسم_او_مجلد_جديد}
EXTRA_NOTES=${4:-لا_توجد_ملاحظات_إضافية}

LIBRARY_NAME="$LIBRARY_NAME" \
SOURCE_HINT="$SOURCE_HINT" \
OUTPUT_HINT="$OUTPUT_HINT" \
EXTRA_NOTES="$EXTRA_NOTES" \
perl -0pe '
  BEGIN {
    %map = (
      "__LIBRARY_NAME__" => $ENV{"LIBRARY_NAME"} // "",
      "__SOURCE_HINT__" => $ENV{"SOURCE_HINT"} // "",
      "__OUTPUT_HINT__" => $ENV{"OUTPUT_HINT"} // "",
      "__EXTRA_NOTES__" => $ENV{"EXTRA_NOTES"} // ""
    );
  }

  for my $key (keys %map) {
    my $value = $map{$key};
    s/\Q$key\E/$value/g;
  }
' "$TEMPLATE_PATH"
