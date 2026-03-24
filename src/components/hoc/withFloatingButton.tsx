import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import FloatingButton from '../atoms/FloatingButton'

function withFloatingButton<Props extends object>(
  WrappedComponent: React.ComponentType<Props>,
  renderFloatingButton: (props: Props) => React.ReactNode
) {
  function WithFloatingButton(props: Props) {
    const [container, setContainer] = useState({
      width: 0,
      height: 0
    })

    const handleLayout = (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout
      setContainer({ width, height })
    }

    // return (
    //   <View style={{ flex: 1 }} onLayout={handleLayout}>
    //     <WrappedComponent {...props} />

    //     {container.width > 0 && <FloatingButton container={container}>{renderFloatingButton(props)}</FloatingButton>}
    //   </View>
    // )
    return (
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        <WrappedComponent {...props} />

        {container.width > 0 && (
          <View
            pointerEvents='box-none'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <FloatingButton container={container}>{renderFloatingButton(props)}</FloatingButton>
          </View>
        )}
      </View>
    )
  }

  WithFloatingButton.displayName = `withFloatingButton(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithFloatingButton
}

export default withFloatingButton
