// Minimal English fallback shown instantly on first render.
// Real translations replace these as soon as the API responds.

const FALLBACK = {
  app_name: 'WikiForms', loading: 'Loading...', preparing: 'Preparing...',
  welcome_title: 'Welcome to WikiForms!', welcome_start: 'Get Started →',
  start_form: 'Fill Out Form', start_quiz: 'Start Quiz',
  submit_form: 'Submit', submit_quiz: 'Submit Quiz',
  next: 'Next', back: 'Back', back_home: 'Back to Home',
  thank_you: 'Submitted!', response_recorded: 'Your response has been recorded.',
  grading: 'Grading...', correct: 'Correct', incorrect: 'Incorrect',
  view_result: 'View My Result', retry_grading: 'Try Again',
  grade_error: 'Could not evaluate your answers right now.',
  field_required: 'This field is required.', your_answer: 'Your answer...', correct_answer_label: 'Correct answer: ',
  anticheat_active: 'Anti-Cheat Active', time_left: 'Time Left',
  session_locked: 'Session Locked', locked_desc: 'Locked due to tab switches.',
  return_home: 'Return to Home', responses: 'Responses',
  no_responses: 'No responses yet.', edit: 'Edit',
  header_login: 'Log In with Wikipedia', header_logout: 'Log Out',
  form_not_found: '404 — Form not found',
  your_answer_label: 'Your answer: ', your_result: 'Your Result',
  excellent: 'Excellent!', good_job: 'Good job!', keep_practicing: 'Keep practicing!',
  quiz_not_started: 'This quiz has not started yet.', quiz_ended: 'This quiz has ended.',
  starts_at: 'Starts: ', warning_msg: 'Warning: Do not leave the quiz!',
  select_placeholder: 'Select...', no_questions: 'No questions found.',
  results_later: 'Results will be shared by the owner later.',
};

const _cache = {};
let _current = { ...FALLBACK };

// Use server-inlined EN translations if available — avoids first API call
if (window.__WF_TRANSLATIONS_EN__) {
  _cache['en'] = { ...FALLBACK, ...window.__WF_TRANSLATIONS_EN__ };
}

export async function loadLang(lang) {
  if (_cache[lang]) {
    _current = _cache[lang];
    return _current;
  }
  try {
    const res = await fetch(`/api/usr-lang/${lang}`);
    const data = await res.json();
    if (data.status === 'success') {
      _cache[lang] = { ...FALLBACK, ...data.keys };
      _current = _cache[lang];
      return _current;
    }
  } catch (e) {}
  return _current;
}

export function t(key, vars = {}) {
  let val = _current[key] ?? FALLBACK[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    val = val.replace(`{${k}}`, v);
  });
  return val;
}

export function getLoadedTranslations() {
  return _current;
}
