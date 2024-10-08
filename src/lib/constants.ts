export const TODOS_API = 'http://localhost:3001/todos';

export const ERROR_MESSAGES = {
  ERROR_TITLE: '❗️ 오류',
  UPDATE_TODO: '할 일 수정에 실패했습니다. 다시 시도해 주세요.',
  DELETE_TODO: '할 일 삭제에 실패했습니다. 다시 시도해 주세요.',
  CREATE_TODO: '할 일 생성에 실패했습니다. 다시 시도해 주세요.',
  GENERIC_ERROR: '오류가 발생했습니다. 다시 시도해 주세요.',
};

export const DIALOG_MESSAGES = {
  CONFIRM_DELETE: '할 일을 정말 삭제할까요?',
  CONFIRM_DISCARD_CHANGES: {
    TITLE: '변경사항이 있습니다',
    DESCRIPTION: '수정을 취소할까요?',
  },
};
