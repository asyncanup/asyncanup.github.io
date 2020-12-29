---
title: Build an AR Drum Set that you play with body gestures
layout: post
---

Let's build an Augmented Reality Drum Set that lets you play drums with your
full body without any musical instruments! What? Yes. Stand in front of camera 👀,
bang imaginary drums with your hands 🥁, drums play for real! 📻🎶

Here's a video:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/4xIckVvjjMQ" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>

## What's really happening here?

Here's what's really happening here:

- Stand in front of camera
  1. App starts phone camera.
  1. App starts looking for human body in frame.
  1. Finds you in the camera frame, and starts capturing body pose at 60fps.

<center>
  <div>(Tap to play)</div>
  <video controls="controls" autoplay="autoplay" loop="loop" width="300">
    <source src="{{ site.baseurl }}{{ site.publicurl }}/tambour/searching.mp4" type="video/mp4">
    Watch video of searching for person in frame
    <a href="{{ site.baseurl }}{{ site.publicurl }}/tambour/searching.mp4">here</a>
  </video>
</center>
<br />

- Bang imaginary drums with your hands
  1. You move your hands around as if playing an imaginary drum set laid out
     around you in 3D space.
  1. App continuously matches the location of your two fists against 3D
     boundaries defined in code.

- Drums play for real
  1. App identifies when tracked fists enter pre-allocated areas in 3D space.
  1. App plays the sound for drum instruments assigned to those areas.

<center>
  <div>(Turn the volume up)</div>
  <video controls="controls" autoplay="autoplay" loop="loop" width="300">
    <source src="{{ site.baseurl }}{{ site.publicurl }}/tambour/playing-mode.mp4" type="video/mp4">
    Watch a video <a href="{{ site.baseurl }}{{ site.publicurl }}/tambour/playing-mode.mp4">here</a>
  </video>
</center>

> Beyond just playing back the intended beat immediately, you can also see in
> the video that, in Recording mode, the app records the beats you hit, and
> replays them on a fixed tempo

## How does the body tracking work?

This demo uses [iOS ARKit's Body
Tracking](https://developer.apple.com/videos/play/wwdc2019/607) feature to track
a human body in frame.

That information could come from your own on-device Machine Learning model,
[Tensorflow
BodyPix](https://blog.tensorflow.org/2019/11/updated-bodypix-2.html),
[PoseNet](https://www.tensorflow.org/lite/models/pose_estimation/overview),
or any other deep neural net.

### Here's how to access body pose tracking data in ARKit

Assuming you have an `ARView` already setup (follow any ARKit Getting Started
tutorial online):

```swift
class ViewController: UIViewController {
    @IBOutlet var arView: ARView!
}
```

Create a new `ARSession` with body pose tracking enabled (at any point after app
startup, maybe in `viewDidLoad()`):
```swift
arView.session.delegate = self
let configuration = ARBodyTrackingConfiguration()
arView.session.run(configuration)
```

You also want to add a new `AnchorEntity` to the `arView` scene:
```swift
let characterAnchor = AnchorEntity()
arView.scene.addAnchor(characterAnchor)
```

Then just add the `session` delegate method for `arView.session`
to get a callback every frame with body pose data as seen by the back camera:
```swift
extension ViewController: ARSessionDelegate {
    func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
        if let bodyAnchor = anchors.first as? ARBodyAnchor,
            let rightHandTransform = bodyAnchor.skeleton.modelTransform(for: .rightHand),
            let leftHandTransform = bodyAnchor.skeleton.modelTransform(for: .leftHand) {
            let leftHand = leftHandTransform.columns.3
            let rightHand = rightHandTransform.columns.3
            update(leftHandAt:  (leftHand.x, leftHand.y),
                   rightHandAt: (rightHand.x, rightHand.y))
        }
    }
}
```

> Note: We only need left and right hand locations for playing drums, so only
> need to extract the 3D locations of those two joints above. Also,
> `transform.colums.3` gives us the 3rd column from the transform matrix, which
> is the position vector of the transform in 3D space.

The `leftHand`, `rightHand` positions sent to `update` in the code above hold
`x` and `y` values relative to the tracked person's hip joint, in meters. Which
means `bodyAnchor.skeleton.modelTransform(for:)` for hip joint returns
`(0, 0, 0)` as the 3D position.

Armed with this knowledge, we can map these locations to imaginary musical
instruments hung around the body in 3D space.

## How does it know which instrument I want to play?

Once there's a human body in the frame, the code divides the area around that
body into 6 regions, and waits for left and right hands to enter those regions.

Those regions are:
- *Bottom Left*: the area under your left hand, at or below waist height.
- *Bottom Right*: the area under your right hand, at or below waist height.
- *Mid Left*: the area to the left of your body, between neck and waist height.
- *Mid Right*: the area to the right of your body, between nect and waist height.
- *Top Left*: the area on top of your left shoulder, at or above neck height.
- *Top Right*: the area on top of your right shoulder, at or above neck height.

Once a body part (left or right hand) enters a mapped region (say, Bottom
right), the instrument (ie, sound) assigned to that region plays.

Here's what those 6 regions are mapped to:
- Bottom Left: a drum sound
- Bottom Right: another drum sound
- Mid Left: a cymbal
- Mid Right: another cymbal
- Top Left: a finger snap representing a skipped beat
- Top Right: change mode from Freestyle to Recording, to Playback.

> Note: when trying to "record" a beat, you need to be able to record a
> "skipped" beat which leaves an empty space during playback. This is what Top
> Left region is for. Punch up with your left hand in recording mode to record a
> skipped beat. As validation that a skipped beat did indeed get recorded, you
> will hear a finger snap sound which doesn't play back in the `playing` mode.

### How are these regions actually defined in code?

Some enums first:

`Hand`:
```swift
enum Hand: String {
    case leftHand = "leftHand"
    case rightHand = "rightHand"
}
```

`HitPosition`, listing the directions where a `Hand` could be at:
```swift
enum HitPosition: String {
    case neutral = "neutral"
    case up = "up"
    case down = "down"
    case left = "left"
    case right = "right"
}
```

`Beat`, a struct to represent a `Hand` + `HitPosition` combination that actually
creates a sound:
```swift
struct Beat: Hashable {
    var hand: Hand
    var hitPosition: HitPosition

    init(_ hand: Hand, _ hitPosition: HitPosition) {
        self.hand = hand
        self.hitPosition = hitPosition
    }
}
```

Given the above, a drum instrument region is completely defined by a `Beat()`
instance, ie, a `Hand` & `HitPosition` combination.

Here's what the different regions map to, in code:
- Bottom Left: `Beat(.leftHand, .down)`
- Bottom Right: `Beat(.rightHand, .down)`
- Mid Left: `Beat(.leftHand, .left)`
- Mid Right: `Beat(.rightHand, .right)`
- Top Left: `Beat(.leftHand, .up)`
- Top Right: `Beat(.rightHand, .up)`

And here's how those regions map to their respective beat sounds:
```swift
let beatAudioName: [Beat: String] = [
    Beat(.leftHand, .up): "snap",
    Beat(.leftHand, .down): "drum2",
    Beat(.leftHand, .left): "snare2",
    Beat(.rightHand, .down): "drum1",
    Beat(.rightHand, .right): "snare1",
]
```

> Notice that there is no `beatAudioName` for "Top Right" region. That's because
> punching the right hand up is used as a gesture for navigating the app between
> different modes, namely, toggling between `recording` beats and `playing` them
> back.

### "Enter" and "Exit" hresholds for the different regions

```
                             TOP
         -------------------  1  -------------------
         |    -------------- 0.8 --------------    |
         |    |    --------- 0.7 ---------    |    |
         |    |    |                     |    |    |
         |    |    |                     |    |    |
         |  -0.4  -0.3      (0, 0.5)    0.3  0.4   |
         |    |    |                     |    |    |
 LEFT   -1    |    |                     |    |    1   RIGHT
         |    |    --------- 0.2 ---------    |    |
         |    -------------- 0.1 --------------    |
         |                                         |
         |                                         |
         |                                         |
         |                                         |
         |                                         |
         ------------------- -1  -------------------
                            BOTTOM
```

The numbers in the figure above define the constraints for hands to enter or
exit the respective regions.

If you imagine a person standing with their hands held close to
chest in a rest position, then here's what the numbers above mean.

LEFT:
- The leftmost `-1` signifies a left hand fully stretched out to the left side.
- `-0.4` signifies the threshold for left hand to "enter" the Mid Left region,
  in order to play the left hand cymbal sound.
- `-0.3` signifies the threshold for left hand to cross in order to "exit"
  the Mid left region and come back to middle rest position.

RIGHT:
- The rightmost `1` signifies a right hand fully stretched out to your right.
- Similar to left hand logic, `0.4` signifies the threshold for right hand to
  "enter" Mid Right region.
- `0.3` signifies the threshold for right hand to "exit" the Mid Right region.

TOP:
- The topmost `1` signifies left or right hand fully stretched out to the top.
- `0.8` signifies the vertical threshold for left and right hands to "enter" the Top Left
  or Top Right region, respectively. To simplify the interaction, left hand can
  only enter Top Left region, and right hand can only enter the Top Right
  region.
- `0.7` signifies the vertical threshold to "exit" the Top Left or Top Right region.

BOTTOM:
- Bottommost `-1` signifies feet, the bottommost point in the body.
- `0.1` signifies the vertical threshold for left and right hands to "enter" the
  Bottom Left or Bottom Right regions, respectively.
- `0.2` signifies the vertical threshold for hands to "exit" Bottom Left or
  Bottom Right regions.

One useful way to think of this constraint scheme is as `(max, entry, exit)`,
where:
- `max` defines the boundary value, the upper bound.
- `entry` defines the threshold for "entering" a region, and
- `exit` defines the threshold for "exiting" the region previously entered.

The reason that I kept separate "enter" and "exit" thresholds for regions is
because otherwise, there would be jitter and unpredictable behavior at the
boundaries, making the interaction very "noisy" (get it?).

Keeping the "enter" thresholds harder to reach, and "exit" thresholds lower
but require having "enter"ed a region previously, makes hitting the drums very
intentional and smooth. It safeguards against small body motion or tracking jitter
from affecting the user experience.

### How are these "Enter" and "Exit" thresholds specified in code?

Here's how. First, you need a way to signify "entering" vs "exiting":

```swift
enum GoingType: String {
    case into = "into"
    case outof = "outof"
}
```

Think of `GoingType` as specifying whether a hand is going `.into` a region, or
`.outof` it.

Given that, here's how the thresholds are specified:

```swift
let hitPositionThresholds: [HitPosition: [GoingType: Float]] = [
    .up: [.into: 0.8, .outof: 0.7],
    .down: [.into: 0.1, .outof: 0.2],
    .left: [.into: 0.4, .outof: 0.3],
    .right: [.into: -0.4, .outof: -0.3]
]
```

Pretty compact, given how much they represent, isn't it? Love that about
Swift enums (and other Swifty data structures).

## So, what's the app's user interface like?

Since ARKit Body Tracking only works with the back camera, you can't actually
see yourself playing the drums. This presents an interesting UX challenge.

*How do you design the user interface or UX for something that has no visual
UI?*

You design a sensorial interface, of course! Purely auditory, in this case.
Meaning you don't need to _see_ the UI because you can _hear_ it.

Being about music creation, the main output of this Augmented Reality Drum Set
is, in fact, audio. So a purely auditory interface can work just fine as long as
other features in the app also produce clearly distinguishable sounds.

*But what about interactions? How do you interact with a non-visual interface?*

With your full body, in this case. So, not only do you bang imaginary drums with
your full body, the user interactions are also mapped directly to clearly
identifiable body gestures.

There is only one user interaction gesture in this demo: *punching up with the
right hand*, which corresponds to the *Top right* region out of the 6 mapped
regions described earlier. Making this gesture progresses the app UI mode from
`freestyle`, to `recording`, to `playing`, proving sufficient for navigating
the app.

To summarize:
- Navigate the app using body gestures (like punching up with the right hand).
- Play drums with body gestures, punching and banging all around (except for,
  you know, punching up with the right hand). Listen to, instead of watch, the
- state of the UI as you navigate through it.

> Even though it's not required for the user, there still exist visual
> indications about the state of the app in the UI, just so a recording or a
> demo makes more sense for someone watching your performance.

## Hmm, can I try it out?

Download [Tambour](https://apps.apple.com/us/app/tambour/id1493473305) from iOS
App Store for your iPhone or iPad.

![Tambour on iOS]({{ site.baseurl }}{{ site.publicurl }}/tambour/logo.png)

