m = angular.module "lens.atoms.flexbox", []


m.controller "FlexboxController", (
  $scope
) ->
  return this


m.directive "flexbox", ->
  controller: "FlexboxController"
  restrict: "E"
  scope: {}
  template: template


template = """
<lens-main>

  <section id="flexbox">
    <p>Flexbox is perfect for aligning items inside components. It typically
      isn't used for large scale layouts but for smaller parts of a page or
      component. All of the flex box utility classes can be used with our
      breakpoint suffixes.</p>
    <h2>Flex Container</h2>
    <p>This is the parent of the items that will be laid out using flex box.</p>

    <h3>Display</h3>
    <p>Defines the flex container and enables a flex context for all of its
      direct children. To apply this to a container with block, use
      <code>.flex-block-xs</code>. To apply it with inline, use
      <code>.flex-inline-xs</code></p>
    <div class="guide-code">
<pre><code class="language-html">&lt;div class="flex-block-xs"&gt;
  &lt;!-- Children --&gt;
&lt;/div&gt;

&lt;div class="flex-inline-xs"&gt;
  &lt;!-- Children --&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Flex Direction</h3>
    <p>This establishes the main-axis, which defines the direction items are palces in the container. Flex lays out in a single direction, either horizontal or vertical.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-row-xs</code></td>
          <td>(Default) Left to right</td>
        </tr>
        <tr>
          <td><code>.flex-row-reverse-xs</code></td>
          <td>Right to left</td>
        </tr>
        <tr>
          <td><code>.flex-column-xs</code></td>
          <td>Same as <code>.flex-row-xs</code> but top to bottom</td>
        </tr>
        <tr>
          <td><code>.flex-column-reverse-xs</code></td>
          <td>Same as <code>.flex-row-reverse-xs</code> but bottom to top</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs border-xs">
      <div class="border-dark-xs text-center-xs m-r-05-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs m-r-05-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs m-r-05-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs flex-column-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs m-b-05-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs m-b-05-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs m-b-05-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs m-r-05-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs m-r-05-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs m-r-05-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-column-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs m-b-05-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs m-b-05-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs m-b-05-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Flex Wrap</h3>
    <p>Flex items will all fit into one line by default. To change that behavior and allow them to wrap, you'll need to add some properties. Flex direction plays a role here by defining the direction new line are stacked.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-nowrap-xs</code></td>
          <td>(Default) Single-line with no wrapping</td>
        </tr>
        <tr>
          <td><code>.flex-wrap-xs</code></td>
          <td>Multi-line from left to right</td>
        </tr>
        <tr>
          <td><code>.flex-wrap-reverse-xs</code></td>
          <td>Multi-line from right to left</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs flex-wrap-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs flex-wrap-reverse-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 350px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="guide-code m-b-4-xs">
  <pre><code class="language-html">&lt;div class="flex-block-xs flex-wrap-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-wrap-reverse-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Justify Content</h3>
    <p>This defines the alignment along the main axis and helps distribute space around the flex items.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-justify-start-xs</code></td>
          <td>(Default) Items are packed toward the start line</td>
        </tr>
        <tr>
          <td><code>.flex-justify-end-xs</code></td>
          <td>Items are packed toward the end line</td>
        </tr>
        <tr>
          <td><code>.flex-justify-center-xs</code></td>
          <td>Items are centered along the line</td>
        </tr>
        <tr>
          <td><code>.flex-justify-between-xs</code></td>
          <td>Items are evenly distributed in the line. First item on the start line, last item on the end line.</td>
        </tr>
        <tr>
          <td><code>.flex-justify-around-xs</code></td>
          <td>Items are evently distributed in the line with equal space around them. Note that visually the spaces aren't equal because each item has equal space on both sides.</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs flex-justify-start-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 150px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 100px; height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="flex-block-xs flex-justify-end-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 150px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 100px; height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="flex-block-xs flex-justify-center-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 150px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 100px; height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="flex-block-xs flex-justify-between-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 150px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 100px; height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="flex-block-xs flex-justify-around-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 150px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 100px; height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs flex-justify-start-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-justify-end-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-justify-center-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-justify-between-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-justify-around-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Align Items</h3>
    <p>This defines how flex items are laid out along the cross axis on the current line.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-item-start-xs</code></td>
          <td>Cross-start margin edge of the items is placed on the cross-start line</td>
        </tr>
        <tr>
          <td><code>.flex-item-end-xs</code></td>
          <td>Cross-end margin edge of the items is placed on the cross-end line</td>
        </tr>
        <tr>
          <td><code>.flex-item-center-xs</code></td>
          <td>Items are centered in the cross-axis</td>
        </tr>
        <tr>
          <td><code>.flex-item-stretch-xs</code></td>
          <td>(Default) Stretch to fill the container but still respects min/max-width</td>
        </tr>
        <tr>
          <td><code>.flex-item-baseline-xs</code></td>
          <td>Items are aligned such as their baselines align</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs flex-item-start-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs flex-item-end-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs flex-item-center-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs flex-item-stretch-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs flex-item-baseline-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 70px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 100px;">4<br>5</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs flex-item-start-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-item-end-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-item-center-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-item-stretch-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-item-baseline-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 70px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 100px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>


    <h3>Align Content</h3>
    <p>This aligns a flex container's lines within when there is extra space in the cross-axis,
      similar to how justify-content aligns items within the main axis. Note: this property
      has no effect when there is only one line of flex items.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-content-start-xs</code></td>
          <td>Lines packed to the start of the container</td>
        </tr>
        <tr>
          <td><code>.flex-content-end-xs</code></td>
          <td>Lines packed to the end of the container</td>
        </tr>
        <tr>
          <td><code>.flex-content-center-xs</code></td>
          <td>Lines packed to the center of the container</td>
        </tr>
        <tr>
          <td><code>.flex-content-around-xs</code></td>
          <td>Lines evenly distributed with the first line at the start and the last at the end of the container.</td>
        </tr>
        <tr>
          <td><code>.flex-content-between-xs</code></td>
          <td>Lines evenly distributed with equal space around each line.</td>
        </tr>
        <tr>
          <td><code>.flex-content-stretch-xs</code></td>
          <td>(Default) Lines stretch to take up the remaining space</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs flex-content-start-xs flex-wrap-xs border-xs" style="min-height:300px;">
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;">4</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;">5</div>
    </div>
    <div class="flex-block-xs flex-content-end-xs flex-wrap-xs border-xs" style="min-height:300px;">
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;">4</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;">5</div>
    </div>
    <div class="flex-block-xs flex-content-center-xs flex-wrap-xs border-xs" style="min-height:300px;">
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;">4</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;">5</div>
    </div>
    <div class="flex-block-xs flex-content-around-xs flex-wrap-xs border-xs" style="min-height:300px;">
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;">4</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;">5</div>
    </div>
    <div class="flex-block-xs flex-content-between-xs flex-wrap-xs border-xs" style="min-height:300px;">
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;">4</div>
      <div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;">5</div>
    </div>
    <div class="guide-code m-b-4-xs">
  <pre><code class="language-html">&lt;div class="flex-block-xs flex-content-start-xs flex-wrap-xs border-xs" style="min-height:300px;"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;"&gt;4&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;"&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-content-end-xs flex-wrap-xs border-xs" style="min-height:300px;"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;"&gt;4&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;"&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-content-center-xs flex-wrap-xs border-xs" style="min-height:300px;"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;"&gt;4&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;"&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-content-around-xs flex-wrap-xs border-xs" style="min-height:300px;"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;"&gt;4&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;"&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs flex-content-between-xs flex-wrap-xs border-xs" style="min-height:300px;"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 500px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 150px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 200px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 300px; line-height: 50px;"&gt;4&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="height: 50px; width: 400px; line-height: 50px;"&gt;5&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>
  </section>

  <section id="Items">
    <h2>Flex Items</h2>
    <p>These are the children of the parent container. Flex items are what take on the flexible box layout for components and pages.</p>

    <h3>Order</h3>
    <p>By default, items are laid out in source order. By using the <code>order</code> property, we can control the order inside the flex container. Lens contains built in ordering classes of <code>.flex-order-[n]-xs</code>, where n is an integer from 1 to 6. Any item without an order will default to 1 and matching orders will be grouped together in the appropriate order. You can rearrange the order across breakpoints with breakpoint suffixes.</p>
    <div class="flex-block-xs border-xs">
      <div class="flex-order-2-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="flex-order-4-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-order-1-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-order-2-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="flex-order-3-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="flex-order-2-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-order-1-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-order-1-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="flex-order-2-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="flex-order-2-xs border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="flex-order-4-xs border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-order-1-xs border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-order-2-xs border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="flex-order-3-xs border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="flex-order-2-lg border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-order-1-lg border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-order-1-lg border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="flex-order-2-lg border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Flex Grow</h3>
    <p>This property lets an item grow if necessary. It accepts a unitless value
      that serves as a proportion. The default is <code>0</code>.</p>
    <div class="flex-block-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-grow-1-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-grow-2-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="flex-grow-6-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-grow-3-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="flex-grow-1-xs border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-grow-2-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-grow-4-lg border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-grow-1-xs border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-grow-2-xs border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="flex-grow-6-xs border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-grow-3-xs border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="flex-grow-1-xs border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-grow-2-lg border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-grow-4-lg border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Flex Shrink</h3>
    <p>This property lets an item shrink if necessary. It accepts a unitless value that serves as a proportion. The default is <code>1</code>.</p>
    <div class="flex-block-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-shrink-2-xs border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-shrink-2-xs border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="flex-shrink-4-xs border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-shrink-3-xs border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">2</div>
      <div class="border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">3</div>
      <div class="flex-shrink-2-xs border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">1</div>
      <div class="flex-shrink-2-lg border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">2</div>
      <div class="flex-shrink-4-lg border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 500px; height: 50px; line-height: 50px;">4</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-shrink-2-xs border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-shrink-2-xs border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="flex-shrink-4-xs border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-shrink-3-xs border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="flex-shrink-2-xs border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;1&lt;/div&gt;
  &lt;div class="flex-shrink-2-lg border-dark-xs text-center-xs"&gt;2&lt;/div&gt;
  &lt;div class="flex-shrink-4-lg border-dark-xs text-center-xs"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs"&gt;4&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Flex Basis</h3>
    <p>This property defines the default size of an element before the remaining space is distributed. It can be a length or keyword, like "auto". The default is <code>auto</code>. To use percentages, use the same widths we have available in our <code>.col</code> classes, like <code>.flex-basis-20-xs</code>. To use our default spacing units, try <code>.flex-basis-s2-xs</code>.</p>
    <div class="flex-block-xs border-xs">
      <div class="flex-basis-33-xs flex-basis-20-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">1</div>
      <div class="flex-basis-33-xs flex-basis-60-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">2</div>
      <div class="flex-basis-33-xs flex-basis-20-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="flex-basis-s2-xs flex-basis-50-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">1</div>
      <div class="flex-basis-s4-xs flex-basis-40-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">2</div>
      <div class="flex-basis-s6-xs flex-basis-10-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;">3</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="flex-basis-33-xs flex-basis-20-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="flex-basis-33-xs flex-basis-60-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="flex-basis-33-xs flex-basis-20-lg border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="flex-basis-s2-xs border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;1&lt;/div&gt;
  &lt;div class="flex-basis-s4-xs border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;2&lt;/div&gt;
  &lt;div class="flex-basis-s6-xs border-dark-xs text-center-xs" style="height: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>

    <h3>Align Self</h3>
    <p>This allows individual flex items to have their own unique alignment within the container.
      This also overrides the container align-items property.</p>
    <table class="table-border-rows">
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>.flex-self-auto-xs</code></td>
          <td>(Default) Auto align, which inherits the align-items property</td>
        </tr>
        <tr>
          <td><code>.flex-self-start-xs</code></td>
          <td>Cross-start margin edge of the items is placed on the cross-start line</td>
        </tr>
        <tr>
          <td><code>.flex-self-end-xs</code></td>
          <td>Cross-end margin edge of the items is placed on the cross-end line</td>
        </tr>
        <tr>
          <td><code>.flex-self-center-xs</code></td>
          <td>Items are centered in the cross-axis</td>
        </tr>
        <tr>
          <td><code>.flex-self-stretch-xs</code></td>
          <td>Stretch to fill the container but still respects min/max-width</td>
        </tr>
        <tr>
          <td><code>.flex-self-baseline-xs</code></td>
          <td>Items are aligned such as their baselines align</td>
        </tr>
      </tbody>
    </table>
    <div class="flex-block-xs border-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="flex-self-start-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="flex-self-end-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="flex-self-center-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="flex-self-stretch-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="flex-block-xs border-xs border-none-t-xs">
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">1<br>2</div>
      <div class="flex-self-baseline-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">3</div>
      <div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;">4<br>5</div>
    </div>
    <div class="guide-code">
  <pre><code class="language-html">&lt;div class="flex-block-xs border-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="flex-self-start-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="flex-self-end-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="flex-self-center-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="flex-self-stretch-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;
&lt;div class="flex-block-xs border-xs border-none-t-xs"&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;1&lt;br&gt;2&lt;/div&gt;
  &lt;div class="flex-self-baseline-xs border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;3&lt;/div&gt;
  &lt;div class="border-dark-xs text-center-xs" style="width: 50px; line-height: 50px;"&gt;4&lt;br&gt;5&lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>
  </section>

</lens-main>
"""
