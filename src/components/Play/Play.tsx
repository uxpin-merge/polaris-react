import * as React from 'react';

import {noop} from '@shopify/javascript-utilities/other';
import compose from '@shopify/react-compose';

import {WithContextTypes} from '../../types';
import withContext from '../WithContext';

import Popover, {Props as PopoverProps} from '../Popover';
import Button, {Props as ButtonProps} from '../Button';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

class ToggleState extends React.PureComponent<
  {children: React.ReactNode},
  ToggleStateState
> {
  state: ToggleStateState = {
    active: false,
  };

  get getContext(): ToggleStateContext {
    return {
      active: this.state.active,
      toggleState: this.toggleState,
    };
  }

  render() {
    return (
      <ToggleStateProvider value={this.getContext}>
        {this.props.children}
      </ToggleStateProvider>
    );
  }

  toggleState = () => {
    const {active} = this.state;
    this.setState({active: !active});
  };
}

const {
  Provider: ToggleStateProvider,
  Consumer: ToggleStateConsumer,
} = React.createContext<ToggleStateContext>({
  active: false,
  toggleState: noop,
});

interface ToggleStateState {
  active: boolean;
}

interface ToggleStateContext extends ToggleStateState {
  toggleState(): void;
}

interface PlayPopoverProps extends Omit<PopoverProps, 'active'> {
  initialActive?: boolean;
}

type ComposedPlayPopoverProps = WithContextTypes<ToggleStateContext> &
  PlayPopoverProps;

function PlayPopover(props: ComposedPlayPopoverProps) {
  const {
    context: {active},
    ...rest
  } = props;

  return <Popover active={active} {...rest} />;
}

type ComposedPlayToggleButtonProps = WithContextTypes<ToggleStateContext> &
  ButtonProps;

function PlayToggleButton(props: ComposedPlayToggleButtonProps) {
  const {
    context: {toggleState},
    ...rest
  } = props;

  return <Button onClick={toggleState} {...rest} />;
}

export default class Play extends React.PureComponent<{}, never> {
  static ToggleState = ToggleState;
  static Popover = compose<PlayPopoverProps>(
    withContext<PlayPopoverProps, {}, ToggleStateContext>(ToggleStateConsumer),
  )(PlayPopover);

  static ToggleButton = compose<ButtonProps>(
    withContext<ButtonProps, {}, ToggleStateContext>(ToggleStateConsumer),
  )(PlayToggleButton);

  render() {
    return null;
  }
}
