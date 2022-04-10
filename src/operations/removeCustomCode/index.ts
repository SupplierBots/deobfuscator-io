import { File } from '@babel/types';
import { traverseUtils } from 'core';

import { REMOVE_SINGLE_CALL_CONTROLLERS } from './visitors/removeSingleCallControllers';
import { REMOVE_DOMAIN_LOCK } from './visitors/removeDomainLock';
import { REMOVE_DEBUG_PROTECTION } from './visitors/removeDebugProtection';
import { REMOVE_CONSOLE_HOOK } from './visitors/removeConsoleHook';
import { REMOVE_SELF_DEFENDING } from './visitors/removeSelfDefending';

export const removeCustomCode = (ast: File) => {
  traverseUtils.runVisitors(
    ast,
    {}, //* Empty state
    REMOVE_SINGLE_CALL_CONTROLLERS,
    REMOVE_DOMAIN_LOCK,
    REMOVE_DEBUG_PROTECTION,
    REMOVE_CONSOLE_HOOK,
    REMOVE_SELF_DEFENDING,
  );
  return ast;
};
